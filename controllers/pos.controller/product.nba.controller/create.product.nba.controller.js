const multer = require("multer");
const fs = require("fs");
const {
  ProductNBA,
  validate,
} = require("../../../models/pos.models/product.nba.model");
const { google } = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-");
  },
});

exports.create = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).single("productNBA_image");
    upload(req, res, async function (err) {
      if (!req.file) {
        const { error } = validate(req.body);
        if (error)
          return res.status(400).send({ message: error.details[0].message });
        await new ProductNBA({
          ...req.body,
        }).save();
        res.status(201).send({ message: "สร้างรายงานใหม่เเล้ว", status: true });
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        uploadFileCreate(req, res);
      }
    });
    async function uploadFileCreate(req, res) {
      const filePath = req.file.path;

      const barcode = await ProductNBA.findOne({
        productNBA_barcode: req.body.productNBA_barcode,
      });
      if (barcode)
        return res.status(409).send({
          status: false,
          message: "มีรหัส Barcode นี้ในระบบเเล้ว",
        });

      let fileMetaData = {
        name: req.file.originalname,
        parents: [process.env.GOOGLE_DRIVE_IMAGE_PRODUCTNBA],
      };
      let media = {
        body: fs.createReadStream(filePath),
      };
      try {
        const response = await drive.files.create({
          resource: fileMetaData,
          media: media,
        });
        generatePublicUrl(response.data.id);
        console.log(req.body);
        const { error } = validate(req.body);
        if (error)
          return res.status(400).send({ message: error.details[0].message });
        await new ProductNBA({
          ...req.body,
          productNBA_image: response.data.id,
        }).save();
        res.status(201).send({ message: "สร้างรายงานใหม่เเล้ว", status: true });
      } catch (error) {
        res
          .status(500)
          .send({ message: "Internal Server Error", status: false });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
async function generatePublicUrl(res) {
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    // console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}
