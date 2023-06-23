const axios = require("axios");
const Joi = require("joi");
const {
  TopupWallet,
  validate_topup_wallet,
} = require("../../models/topup_wallet.model/topup_wallet.model");
const {Partners} = require("../../models/pos.models/partner.model");
const dayjs = require("dayjs");
const {GbPay} = require("../../models/topup_wallet.model/gbpay.model");
const { MoneyHistory } = require("../../models/more.model/money.history.model");
const validate = (data) => {
  const value = Joi.object({
    partner_id: Joi.string().required().label("ไม่พบ partner_id"),
    amount: Joi.number().required().label("ไม่พบจำนวนที่เติม"),
    timestamp: Joi.date().required().label("ไม่พบวันที่ทำรายการ"),
  });
  return value.validate(data);
};

exports.verify = async (req, res) => {
  try {
    const {error} = validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    const invoice = dayjs(req.body.timestamp).format("YYMMDDHHmmss");
    const partner = await Partners.findById(req.body.partner_id);
    const config = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      responseType: "arraybuffer",
    };
    //คำนวณค่าธรรมเนียม
    const num = await calCharge(req.body.amount);

    const data = {
      token: process.env.GB_TOKEN,
      amount: num.amount,
      referenceNo: invoice,
      merchantDefined1: req.body.partner_id,
      merchantDefined2: dayjs(req.body.timestamp).format(),
      backgroundUrl: process.env.GB_CALLBACK,
      detail: "เติมเงินเข้ากระเป๋า Partner ของ One Stop Shop",
      customerName: partner.partner_name,
    };
    const resp = await axios
      .post(`${process.env.GB_URL}/v3/qrcode`, data, config)
      .catch((err) => {
        console.log(err);
      });

    const img =
      "data:image/png;base64," +
      Buffer.from(resp.data, "binary").toString("base64");
    const resp_data = {
      status: true,
      amount: num.amount,
      referenceNo: invoice,
      merchantDefined1: req.body.partner_id,
      merchantDefined2: dayjs(req.body.timestamp).format(),
      image: img,
      charge: num.charge,
      total: num.total,
    };
    return res.status(200).send({...resp_data});
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.check = async(req,res)=>{
    try{
        const validate = (data)=>{
            const schema = Joi.object({
                partner_id : Joi.string().required().label('ไม่พบ partner_id'),
                referenceNo : Joi.string().required().label('ไม่พบรหัสอ้างอิงทำรายการ')
            })
            return schema.validate(data);
        }
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({message:error.details[0].message});
        }

        const data = {
            payment_type : 'qrcode',
            partner_id : req.body.partner_id,
            referenceNo : req.body.referenceNo
        }
        const topup = await TopupWallet.findOne(data);
        console.log(topup);
        if(topup){
            return res.status(200).send({status: true, data: topup})
        }else{
            return res.status(400).send({status: false, message: 'ยังไม่ได้ทำการสแกนจ่ายเข้ามา'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.callback = async (req, res) => {
  try {
    console.log("ตอบกลับจาก GB Pay");
    //หา partner
    const partner = await Partners.findById(req.body.merchantDefined1);
    console.log(partner);
    //สร้าง invoice number
    const invoice = await invoiceNumber(req.body.merchantDefined2);
    console.log("เลข invoice : " + invoice);
    //คำนวนค่าธรรมเนียมและเงินจำนวนเงินเข้ากระเป๋า
    const num = await calCharge(req.body.amount);
    console.log(num);
    //สร้างรายการ topup wallet
    const topup_data = {
      partner_id: partner._id,
      invoice: invoice,
      amount: num.amount,
      charge: num.charge,
      payment_type: "qrcode",
      referenceNo : req.body.referenceNo,
      detail: req.body,
      company: "gbpay",
      status: "รายการสำเร็จ",
      timestamp: dayjs(Date.now()).format(),
    };
    await TopupWallet.create(topup_data);
    //update partner wallet
    const new_wallet = partner.partner_wallet + num.total;
    await Partners.findByIdAndUpdate(partner._id, {partner_wallet: new_wallet});
    //เพิ่มประวัติเงินเข้าของ partner
    const history_data = {
      partner_id: partner._id,
      name: `เติมเงินผ่าน QR Code เลขที่ ${invoice}`,
      type: "เงินเข้า",
      amount: num.total,
      detail: `จำนวนที่จ่าย ${numberFormat(num.amount)} บาท หักค่าธรรมเนียม ${numberFormat(num.charge)} บาท เงินเข้ากระเป๋าสุทธิ ${numberFormat(num.total)} บาท`,
      timestamp : dayjs(Date.now()).format()
    };
    await MoneyHistory.create(history_data);
    return res.status(200).send({status :true, message: 'ทำรายการสำเร็จ'})
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

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

//function คำนวณค่าธรรมเนียมและ ยอดเงินเข้าระบบ
async function calCharge(number) {
  const charge = (number * 2) / 100;
  const amount = number; //ยอดที่ต้องโอน
  const total = number - charge; //ยอดที่เข้ากระเป๋าของ partner

  return {charge, amount, total};
}

//num Format
async function numberFormat(number) {
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}
