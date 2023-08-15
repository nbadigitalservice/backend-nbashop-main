const { PremiumItem } = require('../../models/exchangepoint.model/premiumitem.model')

const fs = require('fs')
const multer = require('multer')
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
        // console.log(file.originalname);
    },
});

//Create
module.exports.create = async (req, res) => {
    try {

        let upload = multer({ storage: storage }).array("imgCollection", 20);
        upload(req, res, async function (err) {
            if (err) {
                return res.status(403).send({ message: 'มีบางอย่างผิดพลาด', data: err });
            }
            const reqFiles = [];

            if (!req.files) {
                res.status(500).send({ message: "มีบางอย่างผิดพลาด", data: 'No Request Files', status: false });
            } else {
                const url = req.protocol + "://" + req.get("host");
                for (var i = 0; i < req.files.length; i++) {
                    await uploadFileCreate(req.files, res, { i, reqFiles });
                }

                //create collection
                const data = {
                    picture: reqFiles[0],
                    name: req.body.name,
                    detail: req.body.detail,
                    exchangerate: Number(req.body.exchangerate),
                    stock: Number(req.body.stock),
                }
                const premiumitem = new PremiumItem(data);
                premiumitem.save(error => {
                    if (error) {
                        res.status(403).send({ status: false, message: 'ไม่สามารถบันทึกได้', data: error })
                    } else {
                        res.status(200).send({ status: true, message: 'บันทึกสำเร็จ' })
                    }
                })
                //end
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

//get All 
module.exports.GetAll = async (req, res) => {
    try {
        const premiumitem = await PremiumItem.find();
        return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: premiumitem })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: 'server side error' })
    }
}

//get by id
module.exports.GetById = async (req, res) => {
    try {
        const premiumitem = await PremiumItem.findById(req.params.id);
        if (!premiumitem) {
            return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' });

        } else {
            return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: premiumitem });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
    }
}

//Update

//change picture
module.exports.update = async (req, res) => {
    try {

        const id = req.params.id;

        const packageUpdate = await PremiumItem.findById(id)

        let upload = multer({ storage: storage }).array("imgCollection", 20);
        upload(req, res, async function (err) {

            const name = req.body.name ? req.body.name : packageUpdate.name
            const detail = req.body.detail ? req.body.detail : packageUpdate.detail
            const exchangerate = req.body.exchangerate ? Number(req.body.exchangerate) : packageUpdate.exchangerate
            const stock = req.body.stock ? Number(req.body.stock) : packageUpdate.stock

            if (err) {
                return res.status(403).send({ message: 'มีบางอย่างผิดพลาด', data: err });
            }
            const reqFiles = [];

            if (!req.files) {
                res.status(500).send({ message: "มีบางอย่างผิดพลาด", data: 'No Request Files', status: false });
            } else {
                const url = req.protocol + "://" + req.get("host");
                for (var i = 0; i < req.files.length; i++) {
                    await uploadFileCreate(req.files, res, { i, reqFiles });
                }

                //Update collection
                const data = {
                    picture: reqFiles[0],
                    name: name,
                    detail: detail,
                    exchangerate: exchangerate,
                    stock: stock,
                }
                PremiumItem.findByIdAndUpdate(id, data, { returnDocument: 'after' }, (err, result) => {
                    if (err) {
                        return res.status(403).send({ message: 'อัพเดทรูปภาพไม่สำเร็จ', data: err })
                    }
                    //delete old picture
                    //* -->
                    //return sucessful response
                    return res.status(200).send({
                        message: 'อัพเดทรูปภาพสำเร็จ', data: {
                            picture: result.picture,
                            name: result.name,
                            detail: result.detail,
                            exchangerate: result.exchangerate,
                            stock: result.stock,
                        }
                    })
                })
                //end
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

//Delete
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        PremiumItem.findByIdAndDelete(id, { returnOriginal: true }, (error, result) => {
            if (error) {
                return res.status(403).send({ status: false, message: 'ลบไม่สำเร็จ', data: error })
            }
            if (result) {
                return res.status(200).send({ status: true, message: 'ลบสำเร็จ' });
            } else {
                return res.status(403).send({ status: false, message: 'ลบไม่สำเร็จ กรุณาลองอีกครั้ง' });
            }
        })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

//update image

async function uploadFileCreate(req, res, { i, reqFiles }) {
    const filePath = req[i].path;
    let fileMetaData = {
      name: req.originalname,
      parents: [process.env.GOOGLE_DRIVE_IMAGE_EXCHANGE_POINT],
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
      reqFiles.push(response.data.id);
  
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
  
  async function generatePublicUrl(res) {
    console.log("generatePublicUrl");
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
      console.log(result.data);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
