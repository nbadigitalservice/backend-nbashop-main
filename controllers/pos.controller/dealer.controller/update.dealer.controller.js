const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Dealers, validate } = require("../../../models/pos.models/dealer.model");
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
    console.log(file);
    cb(null, file.fieldname + "-" + Date.now());
  },
});
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    let upload = multer({ storage: storage }).fields([
      { name: "dealer_bookbank", maxCount: 10 },
      { name: "dealer_iden", maxCount: 10 },
    ]);

    upload(req, res, async function (err) {
      console.log(req.files, "มีัไฟล์ไหม");
      // if (!req.files.dealer_iden && !req.files.dealer_bookbank) {
      if (!req.files) {
        console.log("ไม่มีรูปทั้ง 2 รูป");
        await uploadFileNoImage(req, res);
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else if (req.files.dealer_iden && req.files.dealer_bookbank) {
        console.log("มีรูปทั้ง 2 รูป");
        await uploadFileEditTwoImage(req, res);
      } else if (req.files.dealer_iden && !req.files.dealer_bookbank) {
        await console.log("มีรูป1 รูปคือ dealer_iden");
        uploadFileEditImageIden(req, res);
      } else if (!req.files.dealer_iden && req.files.dealer_bookbank) {
        console.log("มีรูป1 รูปคือ dealer_bookbank");
        await uploadFileEditImageBank(req, res);
      }
    });
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
  }
  async function uploadFileEditTwoImage(req, res) {
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
      // const { error } = validate(req.body);
      // if (error)
      //   return res
      //     .status(400)
      //     .send({ message: error.details[0].message, status: false });
      if (req.body.dealer_password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.dealer_password, salt);
        Dealers.findByIdAndUpdate(
          id,
          {
            ...req.body,
            dealer_password: hashPassword,
            dealer_iden: responseIden.data.id,
            dealer_bookbank: responseBank.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      } else {
        Dealers.findByIdAndUpdate(
          id,
          {
            ...req.body,
            dealer_iden: responseIden.data.id,
            dealer_bookbank: responseBank.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
    }
  }
  async function uploadFileEditImageIden(req, res) {
    try {
      const filePathIden = req.files.dealer_iden[0].path;

      let fileMetaDataIden = {
        name: req.files.dealer_iden[0].originalname,
        parents: [`${process.env.GOOGLE_DRIVE_IMAGE_DEALER}`],
      };

      let mediaIden = {
        body: fs.createReadStream(filePathIden),
      };

      const responseIden = await drive.files.create({
        resource: fileMetaDataIden,
        media: mediaIden,
      });

      // const { error } = validate(req.body);
      // if (error)
      //   return res
      //     .status(400)
      //     .send({ message: error.details[0].message, status: false });
      if (req.body.dealer_password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.dealer_password, salt);
        Dealers.findByIdAndUpdate(
          id,
          {
            ...req.body,
            dealer_password: hashPassword,
            dealer_iden: responseIden.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      } else {
        Dealers.findByIdAndUpdate(
          id,
          {
            ...req.body,
            dealer_iden: responseIden.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
    }
  }
  async function uploadFileEditImageBank(req, res) {
    try {
      const filePathBank = req.files.dealer_bookbank[0].path;

      let fileMetaDataBank = {
        name: req.files.dealer_bookbank[0].originalname,
        parents: [`${process.env.GOOGLE_DRIVE_IMAGE_DEALER}`],
      };

      let mediaBank = {
        body: fs.createReadStream(filePathBank),
      };

      const responseBank = await drive.files.create({
        resource: fileMetaDataBank,
        media: mediaBank,
      });
      // const { error } = validate(req.body);
      // if (error)
      //   return res
      //     .status(400)
      //     .send({ message: error.details[0].message, status: false });
      if (req.body.dealer_password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.dealer_password, salt);
        Dealers.findByIdAndUpdate(
          id,
          {
            ...req.body,
            dealer_password: hashPassword,
            dealer_bookbank: responseBank.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      } else {
        Dealers.findByIdAndUpdate(
          id,
          {
            ...req.body,
            dealer_bookbank: responseBank.data.id,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
    }
  }
  async function uploadFileNoImage(req, res) {
    console.log("อะไรวะ");
    const id = req.params.id;
    if (req.body.dealer_password) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.dealer_password, salt);
      Dealers.findByIdAndUpdate(
        id,
        {
          ...req.body,
          dealer_password: hashPassword,
        },
        { useFindAndModify: false }
      )
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
              status: false,
            });
          } else
            res.send({
              message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
            status: false,
          });
        });
    } else {
      console.log("ไม่มีรูปและพาร์าส");
      Dealers.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        { useFindAndModify: false }
      )
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
              status: false,
            });
          } else
            res.send({
              message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
              status: true,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
            status: false,
          });
        });
    }
  }
};
