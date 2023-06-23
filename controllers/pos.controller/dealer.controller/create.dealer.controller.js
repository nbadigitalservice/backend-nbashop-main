const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const {
  Dealers,
  validate,
} = require("../../../models/pos.models/dealer.model");
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

var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
exports.create = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).fields([
      { name: "dealer_bookbank", maxCount: 10 },
      { name: "dealer_iden", maxCount: 10 },
    ]);

    upload(req, res, function (err) {
      if (!req.files) {
        return res.send("กรุณาส่งไฟล์รูปภาพด้วย");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
      console.log("มีรูป 2 รูป");
      uploadFileCreate(req, res);
    });
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
  }
  async function uploadFileCreate(req, res) {
    try {
      const filePathIden = req.files.dealer_iden[0].path;
      const filePathBank = req.files.dealer_bookbank[0].path;

      let fileMetaDataIden = {
        name: req.files.dealer_iden[0].originalname,
        parents: [`${process.env.GOOGLE_DRIVE_IMAGE_DEALER}`],
      };
      let fileMetaDataBank = {
        name: req.files.dealer_bookbank[0].originalname,
        parents: [`${process.env.GOOGLE_DRIVE_IMAGE_DEALER}`],
      };
      console.log(fileMetaDataIden);
      let mediaIden = {
        body: fs.createReadStream(filePathIden),
      };
      let mediaBank = {
        body: fs.createReadStream(filePathBank),
      };

      const responseIden = await drive.files.create({
        resource: fileMetaDataIden,
        media: mediaIden,
      });
      const responseBank = await drive.files.create({
        resource: fileMetaDataBank,
        media: mediaBank,
      });
      console.log(req.body);
      const { error } = validate(req.body);
      if (error)
        return res
          .status(400)
          .send({ message: error.details[0].message, status: false });
      const user = await Dealers.findOne({
        dealer_phone: req.body.dealer_phone,
      });
      console.log("user=>", user);
      if (user) {
        await drive.files.delete({
          fileId: responseIden.data.id.toString(),
        });
        await drive.files.delete({
          fileId: responseBank.data.id.toString(),
        });
        return res.status(409).send({
          message: "หมายเลขโทรศัพท์นี้ มีอยู่ในระบบเเล้ว",
          status: false,
        });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.dealer_password, salt);

      const result = await new Dealers({
        ...req.body,
        dealer_password: hashPassword,
        dealer_iden: responseIden.data.id,
        dealer_bookbank: responseBank.data.id,
      }).save();

      res.status(201).send({
        member_id: result._id,
        message: "เพิ่มข้อมูลผู้ใช้งานสำเร็จ",
        status: true,
      });
    } catch (error) {
      res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
    }
  }
};
