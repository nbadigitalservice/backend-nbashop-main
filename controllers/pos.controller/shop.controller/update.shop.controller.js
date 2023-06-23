const multer = require("multer");
const fs = require("fs");
const { Shop, validate } = require("../../../models/pos.models/shop.model");
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
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.update = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).single("shop_logo");
    upload(req, res, async function (err) {
      console.log(req.file);
      if (!req.file) {
        if (!req.body) {
          return res.status(400).send({
            message: "ส่งข้อมูลผิดพลาด",
          });
        }
        const id = req.params.id;
        Shop.findByIdAndUpdate(id, req.body, {
          useFindAndModify: false,
        })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขรายงานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขรายงานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "มีบ่างอย่างผิดพลาด",
              status: false,
            });
          });
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        uploadFile(req, res);
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
async function uploadFile(req, res) {
  const filePath = req.file.path;
  let fileMetaData = {
    name: req.file.originalname,
    parents: [process.env.GOOGLE_DRIVE_IMAGE_SHOP],
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
    const id = req.params.id;
    Shop.findByIdAndUpdate(
      id,
      { ...req.body, shop_logo: response.data.id },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Advert with id=${id}. Maybe Advert was not found!`,
          });
        } else
          res.status(201).send({
            message: "แก้ไขรายงานสำเร็จ.",
            status: true,
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Advert with id=" + id,
        });
      });
  } catch (error) {
    console.log(error.massage);
  }
}
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
  } catch (error) {
    console.log(error.message);
  }
}
