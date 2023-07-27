const axios = require("axios");
const dayjs = require("dayjs");
const {PercentCs} = require("../../models/cs.model/percent.model");
const {OrderCs, validate} = require("../../models/cs.model/order.cs.model");
const {OrderSot} = require("../../models/cs.model/order.sot.model");

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

exports.check = async (req, res) => {
  console.log('req')
  try {
    const {mobile, barcode} = req.body;
    if (
      mobile === undefined ||
      barcode === undefined ||
      mobile === "" ||
      barcode === ""
    ) {
      
      return res
        .status(400)
        .send({status: false, message: "กรุณาส่งข้อมูลให้ครบถ้วน"});
    }

    const data = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "scanbarcode",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
          mobile: mobile,
          barcode: barcode,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
      });
    if (data) {
      
      if (data.data.error_code === "E00") {
        const amount = data.data.amount.replace(/,/g,'');
        return res
          .status(200)
          .send({status: true, ...data.data, amount: parseFloat(amount)});
      } else {
        console.log('err')

        return res.status(400).send({status: false,message:'ไม่สามารถชำระได้', ...data.data});
      }
    } else {
      return res.status(400).send({status: false, message: ""});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.verify = async (req, res) => {
  try {
    const {productid, mobile, price, data1, data2, data3, data4, data5} =
      req.body;
    if (
      productid === undefined ||
      mobile === undefined ||
      price === undefined ||
      data1 === undefined ||
      data2 === undefined ||
      data3 === undefined ||
      data4 === undefined ||
      data5 === undefined
    ) {
      return res.status(400).send({status: false, message: "ข้อมูลไม่ครบถ้วน"});
    }
    let percent = await PercentCs.findOne({code: "barcode"});

    if (!percent) {
      percent = {code: "barcode", cost_nba: 2, cost_shop: 3, hp_div: 1};
    }

    const data = await axios.post(
      process.env.OWS_URL,
      {
        service: "paybillmobileverify",
        username: process.env.OWS_USERNAME,
        password: process.env.OWS_PASSWORD,
        productid: productid,
        price: String(price),
        mobile: mobile,
        data1: data1,
        data2: data2,
        data3: data3,
        data4: data4,
        data5: data5,
      },
      config_agent
    );

    if (data) {
      if (data.data.error_code === "E00") {
        const new_data = {
          status: true,
          ...data.data,
          charge:
            parseFloat(data.data.charge) + percent.cost_nba + percent.cost_shop,
          cost_nba: percent.cost_nba,
          cost_shop: percent.cost_shop,
          price: price,
        };
        return res.status(200).send(new_data);
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

exports.confirm = async (req, res) => {
  try {
    // const {error} = validate(req.body);
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
        service: "paybillbarcodeconfirm",
        username: process.env.OWS_USERNAME,
        password: process.env.OWS_PASSWORD,
        transid: req.body.transid,
      },
      config_agent
    );

    if (data) {
      if (data.data.error_text === "OK") {
        await OrderSot.create({...data.data, service: "barcode"});
        const invoice = await invoiceNumber(
          req.body.shop_id,
          req.body.timestamp
        );
        const order_cs = await OrderCs.create({
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
  const order = await OrderCs.find();
  let invoice_number = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `CS${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      check = await OrderCs.find({invoice: data});
      console.log(check);
      if (check.length === 0) {
        invoice_number =
          `CS${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_number = `CS${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + "1";
  }
  return invoice_number;
}
