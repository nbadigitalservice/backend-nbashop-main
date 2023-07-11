const axios = require("axios");
const dayjs = require('dayjs');
const {OrderSot} = require('../../models/cs.model/order.sot.model')
const {
  MobileTopup,
  validate_mobile_topup,
} = require("../../models/mobile_topup.model/mobile_topup.model");

//CERTIFICATE SOT
const https = require("https");
const fs = require("fs");
const path = require("path");
const certFile = path.resolve(__dirname, "../../cert/client_nba.crt");
const keyFile = path.resolve(__dirname, "../../cert/client_nba_rsa.key");
let config_agent = null;

if (process.env.SERVICE === "production") {
  config_agent = {
    httpsAgent: new https.Agent({
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
      rejectUnauthorized: false,
      passphrase: "Qwer!234",
    }),
  };
}

exports.verify = async (req, res) => {
  try {
    console.log(req.body);
    const {mobile, price, productid} = req.body;
    if (
      mobile === undefined ||
      price === undefined ||
      productid === undefined
    ) {
      console.log('ข้อความไม่ครบถ้วน')
      return res.status(400).send({status: false, message: "ข้อมูลไม่ครบถ้วน"});
    }

    const data = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "topupmobileverify",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
          mobile: mobile,
          productid: productid,
          price: price,
        },
        config_agent
      )
      .catch((err) => {
        console.log('axios error',err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
      });
      if (data) {
      console.log('data',data);
     
      if (data && data.data.error_code === "E00") {
        const nba = 0.5;
        let percent = 3;
        if (productid === "p00003" || productid === "p00016") {
          percent = 2;
        }
        //หาต้นทุน
        const profit_shop = (price * (percent - nba)) / 100;
        const profit_nba = (price * nba) / 100;
        const cost = price - profit_shop;
        return res.status(200).send({
          status: true,
          ...data.data,
          charge: parseFloat(data.data.charge.replace(/,/g, "")),
          price:price,
          profit_nba: profit_nba,
          profit_shop: profit_shop,
          cost: cost,
        });
      } else {
        return res.status(400).send({status: false,message:data.data.error_text, ...data.data});
      }
    } else {
      return res.status(400).send({status: false, message: 'error not response'});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.confirm = async (req, res) => {
  try {
    // const {error} = validate_mobile_topup(req.body);
    // if (error) {
    //   return res
    //     .status(400)
    //     .send({status: false, message: error.details[0].message});
    // }
    if (req.body.transid === undefined) {
   
      return res.status(400).send({status: false, message: "ไม่พบ transid"});
    }
    const data = await axios.post(
      process.env.OWS_URL,
      {
        service: "topupmobileconfirm",
        username: process.env.OWS_USERNAME,
        password: process.env.OWS_PASSWORD,
        transid: req.body.transid,
      },
      config_agent
    );

    if (data) {
      if (data.data.error_text === "OK") {
        await OrderSot.create({...data.data, service: "topup"});
        const invoice = await invoiceNumber(
          req.body.shop_id,
          req.body.timestamp
        );
        const order_cs = await MobileTopup.create({
          ...req.body,
          company: "SOT",
          invoice: invoice,
          detail: data.data,
        });
        if (order_cs) {
          return res.status(200).send({status: true, data: order_cs});
        } else {
          return res
            .status(500)
            .send({status: false, message: "เพิ่มข้อมูลไม่สำเร็จ"});
        }
      } else {
        return res.status(400).send({status: false, ...data.data});
      }
    } else {
      return res
        .status(500)
        .send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

//ค้นหาและสร้างเลข invoice
async function invoiceNumber(shop_id, date) {
  const order = await MobileTopup.find();
  let invoice_number = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `MT${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      check = await MobileTopup.find({invoice: data});
      console.log(check);
      if (check.length === 0) {
        invoice_number =
          `MT${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_number = `MT${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + "1";
  }
  return invoice_number;
}
