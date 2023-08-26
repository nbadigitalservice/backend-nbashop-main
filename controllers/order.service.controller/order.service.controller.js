const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')
const { OrderCanceled } = require('../../models/order.service.model/order.canceled.model')
const { OrderDeliverModel } = require('../../models/order.service.model/order.deliver.model')
const { AccountPackageModel } = require('../../models/account.service.model/account.service.package.model')
const { ActPackageModel } = require('../../models/act.service.model/act.service.package.model')
const { FacebookPackage } = require('../../models/facebook.model/facebook.package.model')
const { InsurancePackageModel } = require('../../models/insurance.model/insurance.package.model')
const { ItsupportPackage } = require('../../models/itsupport.model/itsupport.package.model')
const { WebsitePackageModel } = require('../../models/website.package.model/website.package.model')
const { ProductGraphicPrice } = require('../../models/pos.models/product.graphic.price.model')
const { Partners } = require('../../models/pos.models/partner.model')
const axios = require('axios')
const cryptoJs = require('crypto-js')
const dayjs = require('dayjs')
const multer = require('multer')
const fs = require('fs')
const { google } = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
})

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    // console.log(file.originalname);
  },
})

module.exports.confirm = async (req, res) => {

  const updateStatus = await OrderServiceModel.findOne({ _id: req.params.id })
  console.log(updateStatus);
  if (updateStatus) {
    await OrderServiceModel.findByIdAndUpdate(updateStatus._id, { status: 'กำลังดำเนินการ' })
  } else {
    return res.status(403).send({ message: 'เกิดข้อผิดพลาด' })
  } return res.status(200).send({ message: 'คอนเฟิร์มออร์เดอร์สำเร็จ' })
}

//get All order
module.exports.GetAll = async (req, res) => {
  try {
    console.log(req.decoded)
    const orderservice = await OrderServiceModel.find()
    return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: orderservice })

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: 'server side error' })
  }
}

//get order by id
module.exports.GetById = async (req, res) => {
  try {
    const orderservice = await OrderServiceModel.findById(req.params.id)
    if (!orderservice) {
      return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' })

    } else {
      return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: orderservice })
    }

  } catch (error) {
    console.error(error)
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
  }
}

module.exports.GetTotalPriceSumByTel = async (req, res) => {
  try {
    let tel = req.user.partner_phone
    if (req.user.partner_name === "NBA_PLATEFORM") {
      tel = req.body.tel
    }
    const pipeline = [
      {
        $match: { customer_tel: tel }
      },
      {
        $group: {
          _id: '$customer_tel',
          userAllsale: { $sum: '$totalprice' }
        }
      },
      {
        $project: {
          _id: 0,
          customer_tel: '$_id',
          userAllsale: 1
        }
      }
    ];

    const result = await OrderServiceModel.aggregate(pipeline)

    return res.status(200).send({ message: 'ดึงข้อมูลสำเร็จ', data: result })
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'มีบางอย่างผิดพลาด', data: error.data })
  }
}

module.exports.cancel = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderServiceModel.findOne({ _id: orderId });

    if (!order) {
      return res.status(403).send({ message: 'ไม่พบข้อมูลออร์เดอร์' });
    }

    // Check if the order is already cancelled
    if (order.status === 'ถูกยกเลิก') {
      return res.status(200).send({ message: 'ออร์เดอร์ถูกยกเลิกแล้ว' });
    }

    // Mark the order as cancelled
    await OrderServiceModel.findByIdAndUpdate(orderId, { status: 'ถูกยกเลิก' });

    // Create an entry in the 'ordercanceled' schema
    const canceledOrder = new OrderCanceled({
      orderid: order._id,
      receiptnumber: order.receiptnumber,
      cost: order.totalCost,
      customer_name: order.customer_name,
      customer_tel: order.customer_contact,
      refund_amount: order.totalCost,
      reason: req.body.reason,
      admin_id: req.decoded._id,
      admin_name: req.decoded.name,
    });

    await canceledOrder.save();

    // Find the partner using their ID
    const partner = await Partners.findOne({ partner_phone: order.customer_tel });

    if (!partner) {
      return res.status(403).send({ message: 'ไม่พบข้อมูลพาร์ทเนอร์' });
    }

    if (order.partnername === "shop") {
      // Update the partner's wallet by adding the refund amount
      partner.partner_wallet += order.totalCost;
      await partner.save();
    } else {
      //encryptdata
      const payload = cryptoJs.AES.encrypt(JSON.stringify(canceledOrder), process.env.API_GIVE_COMMISSION).toString();
      const request = {
        method: 'post',
        headers: {
          'token': process.env.NBA_PLATFORM_SECRET_KEY,
          'Content-Type': 'application/json'
        },
        url: `${process.env.NBA_PLATFORM}order/receiverefund`,
        data: { payload: payload, tel: order.customer_tel }
      }

      try {
        const response = await axios(request)
        if (response) {
          return res.status(200).send({ message: 'ยกเลิกออร์เดอร์ และทำการคืนเงินเรียบร้อย', data: response.data })
        }
      } catch (error) {
        console.log(error)
        return res.status(400).send({ message: 'มีบางอย่างผิดพลาด', data: error.message })
      }

    }
    return res.status(200).send({ message: 'ยกเลิกออร์เดอร์และบันทึกข้อมูลสำเร็จ', data: canceledOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'มีบางอย่างผิดพลาด', error: error.message });
  }
}

async function getProductPackageModel(servicename, product_detail) {
  let packageModel;

  switch (servicename) {
    case 'Account Service':
      packageModel = AccountPackageModel;
      break;
    case 'Act of legislation Service(พรบ.)':
      packageModel = ActPackageModel;
      break;
    case 'Facebook Service':
      packageModel = FacebookPackage;
      break;
    case 'Insurance Service(ประกัน)':
      packageModel = InsurancePackageModel;
      break;
    case 'IT Support Service':
      packageModel = ItsupportPackage;
      break;
    case 'Website Service':
      packageModel = WebsitePackageModel;
      break;
    case 'Artwork':
      packageModel = ProductGraphicPrice;
      break;
    default:
      throw new Error('ไม่สามารถระบุแพ็คเกจที่ถูกยกเลิกได้');
  }
}

module.exports.acceptTask = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderServiceModel.findOne({ _id: orderId });

    if (!order) {
      return res.status(403).send({ message: 'ไม่พบข้อมูลออร์เดอร์' });
    }

    await OrderServiceModel.findByIdAndUpdate(orderId, {
      status: req.body.status,
      responsible_id: req.body._id,
      responsible_name: req.body.name,
    });

    return res.status(200).send({ message: 'รับงานแล้ว', data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'มีบางอย่างผิดพลาด', error: error.message });
  }
}

//get All canceled order
module.exports.GetAllCanceledOrder = async (req, res) => {
  try {
    console.log(req.decoded)
    const ordercanceled = await OrderCanceled.find()
    return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: ordercanceled })

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: 'server side error' })
  }
}

//get canceled order by id
module.exports.GetCanceledOrderById = async (req, res) => {
  try {
    const ordercanceled = await OrderCanceled.findById(req.params.id)
    if (!ordercanceled) {
      return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' })

    } else {
      return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: ordercanceled })
    }

  } catch (error) {
    console.error(error)
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
  }
}

//get canceled order by tel
module.exports.GetCanceledOrderByTel = async (req, res) => {
  try {
    let tel = req.user.partner_phone
    if (req.user.partner_name === "NBA_PLATEFORM") {
      tel = req.body.tel
    }
    const ordercanceled = await OrderCanceled.find({ customer_tel: tel })
    if (!ordercanceled) {
      return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' })

    } else {
      return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: ordercanceled })
    }

  } catch (error) {
    console.error(error)
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
  }
}

module.exports.DeliverOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderServiceModel.findOne({ _id: orderId });
    if (!order) {
      return res.status(403).send({ message: 'ไม่พบข้อมูลออร์เดอร์' });
    }
    await OrderServiceModel.findByIdAndUpdate(orderId, { status: 'เรียบร้อย' });

    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(403).send({ message: 'มีบางอย่างผิดพลาด', data: err });
      }

      const pictures = []

      for (var i = 0; i < req.files.length; i++) {
        await uploadFileCreate(req.files, res, { i, pictures });
      }

      for (const picture of pictures) {
        picture.imgUrl = picture.imgUrl.replace('&export=download', '');
      }

      //create collection
      const data = {
        orderid: orderId,
        detail: req.body.detail,
        picture: pictures,
        transport: req.body.transport,
        trackingNo: req.body.trackingNo,
      }
      const orderDeliver = new OrderDeliverModel(data);
      orderDeliver.save(error => {
        if (error) {
          res.status(403).send({ status: false, message: 'ไม่สามารถบันทึกข้อมูลได้', data: error })
        } else {
          res.status(200).send({ status: true, message: 'อัพเดทสถานะออร์เดอร์เป็น "เรียบร้อย" และบันทึกข้อมูลการจัดส่งสำเร็จ', data: orderDeliver })
        }
      })

    })
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'มีบางอย่างผิดพลาด', error: error.message });
  }
}

//update image
async function uploadFileCreate(req, res, { i, pictures }) {
  const filePath = req[i].path;
  let fileMetaData = {
    name: req.originalname,
    parents: [process.env.GOOGLE_DRIVE_IMAGE_ORDER_DELIVER],
  };
  let media = {
    body: fs.createReadStream(filePath),
  };
  try {
    const response = await drive.files.create({
      resource: fileMetaData,
      media: media,
    });

    const url = await generatePublicUrl(response.data.id);
    pictures.push({ fileId: response.data.id, imgUrl: url.webContentLink });

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

    return result.data;
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
}