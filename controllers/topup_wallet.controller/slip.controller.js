const {
  TopupWallet,
  validate_topup_wallet,
} = require("../../models/topup_wallet.model/topup_wallet.model");
const {WalletHistory} = require("../../models/wallet.history.model");
const {Partners} = require("../../models/pos.models/partner.model");
const line = require("../../lib/line.notify");
const dayjs = require("dayjs");
const multer = require("multer");
const fs = require("fs");
const {google} = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-");
  },
});

//สร้างรายการ
exports.create = async (req, res) => {
  try {
    let upload = multer({storage: storage}).single("slip_img");

    upload(req, res, async function (err) {
      if (!req.file) {
        const {error} = validate_topup_wallet(req.body);
        if (error)
          return res.status(400).send({message: error.details[0].message});
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

      let fileMetaData = {
        name: req.file.originalname,
        parents: [process.env.GOOGLE_DRIVE_WALLET_TOPUP],
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
        const {error} = validate_topup_wallet(req.body);
        const invoice = await invoiceNumber(req.body.timestamp);
        console.log("invoice : " + invoice);
        if (error)
          return res.status(400).send({message: error.details[0].message});

        const partner = await Partners.findById(req.body.partner_id);
        const data = {
          ...req.body,
          company: "NBA",
          payment_type: "slip",
          invoice: invoice,
          detail: {
            slip_img: response.data.id,
          },
          timestamp: dayjs(Date.now()).format(""),
        };
        const topup = await TopupWallet.create(data);
        const message = `
แจ้งเติมเงินเข้าระบบ : 
เลขที่ทำรายการ : ${invoice}
ชื่อ : ${partner.partner_name}
จำนวน : ${req.body.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  บาท
            `;
        await line.linenotify(message);
        res
          .status(201)
          .send({message: "สร้างรายงานใหม่เเล้ว", status: true, data: topup});
      } catch (error) {
        console.log(error);
        res.status(500).send({message: "Internal Server Error", status: false});
      }
    }
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

//อัพเดตข้อมูลการแจ้งเติมเงิน
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    if (
      !(
        req.body.status !== "รอตรวจสอบ" ||
        req.body.status !== "ตรวจสอบสำเร็จ" ||
        req.body.status !== "ยกเลิก"
      )
    ) {
      return res.status(400).send({
        status: false,
        message:
          "status : จะต้องเป็น รอตรวจสอบ, ตรวจสอบสำเร็จ, ยกเลิก เท่านั้น",
      });
    }
    if (req.body.status === "ยกเลิก" && !req.body.remark) {
      return res.status(400).send({
        status: false,
        message: "กรณียกเลิก จะต้องมี Remark หรือ เหตุผลที่ยกเลิก",
      });
    }
    const topup_wallet = await TopupWallet.findByIdAndUpdate(id, req.body);
    if (topup_wallet) {
      const history_data = {
        shop_id: topup_wallet.shop_id,
        partner_id: topup_wallet.partner_id,
        orderid: `เติมเงินแนบสลิป เลขที่ ${topup_wallet.invoice}`,
        type: "เงินเข้า",
        amount: topup_wallet.amount,
        name: `เงินเข้ากระเป๋าสุทธิ ${topup_wallet.amount} บาท`,
        timestamp: dayjs(Date.now()).format(""),
      };
      const new_history = new WalletHistory(history_data);
      new_history.save();
      return res
        .status(200)
        .send({status: true, message: "อัพเดตข้อมูลสำเร็จ"});
    } else {
      return res
        .status(400)
        .send({status: false, message: "อัพเดตข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

//num Format
async function numberFormat(number) {
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
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
    // console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}

//ค้นหาและสร้างเลข invoice
async function invoiceNumber(date) {
  const order = await TopupWallet.find();
  let invoice_number = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      check = await TopupWallet.find({invoice: data});
      console.log(check);
      if (check.length === 0) {
        invoice_number =
          `${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_number = `${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + "1";
  }
  console.log(invoice_number);
  return invoice_number;
}
