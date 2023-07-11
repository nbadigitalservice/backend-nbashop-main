const axios = require("axios");
const {OrderSot} = require("../../models/cs.model/order.sot.model");
const {ServiceNBA}= require('../../models/more.model/service.nba.model')

//CERTIFICATE SOT
const https = require("https");
const fs = require("fs");
const path = require("path");
const certFile = path.resolve(__dirname, "../../cert/client_nba.crt");
const keyFile = path.resolve(__dirname, "../../cert/client_nba_rsa.key");
let config_agent = null;
if(process.env.SERVICE==='production'){
    config_agent = {
        httpsAgent: new https.Agent({
          cert: fs.readFileSync(certFile),
          key: fs.readFileSync(keyFile),
          rejectUnauthorized: false,
          passphrase: "Qwer!234",
        }),
      };
}


//get Service NBA
exports.getNBAService = async(req, res)=>{
  try{
    const service = await ServiceNBA.find({status: true});
    if(service){
      return res.status(200).send({status: true, data: service})
    }else{
      return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
    }
  }catch(err){
    return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
  }
}


//get Profile
exports.profile = async (req, res) => {
  try {
    console.log('--Get Profile--')
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "profile",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      //console.log(services);
      return res.status(200).send({data: services.data});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getAllService = async (req, res) => {
  try {
    console.log("get all counter service");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      //console.log(services);
      return res.status(200).send({data: services.data});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getMobileService = async (req, res) => {
  try {
    console.log("GET MOBILE SERVICE");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const mobile = await services.data.detail.mobile.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: mobile});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getMobileBillService = async (req, res) => {
  try {
    console.log("GET MOBILE BILL");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const mobile = await services.data.detail.mobile_bill.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: mobile});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getCardService = async (req, res) => {
  try {
    console.log("GET CARD SERVICE");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const service = await services.data.detail.card.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: service});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getBarcodeService = async (req, res) => {
  try {
    console.log("GET Barcode SERVICE");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        }, config_agent)
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const service = await services.data.detail.barcode.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: service});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getLottoService = async (req, res) => {
  try {
    console.log("GET Lotto SERVICE");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const service = await services.data.detail.lotto.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: service});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getMoneyTransferService = async (req, res) => {
  try {
    console.log("GET Money Transfer SERVICE");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const service = await services.data.detail.moneytransfer.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: service});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getProsermService = async (req, res) => {
  try {
    console.log("GET Proserm SERVICE");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const service = await services.data.detail.proserm.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: service});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getWalletService = async (req, res) => {
  try {
    console.log("GET Wallet SERVICE");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const service = await services.data.detail.wallet.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: service});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getCashInService = async (req, res) => {
  try {
    console.log("GET CashIn SERVICE");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const service = await services.data.detail.cashin.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: service});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getKeyInService = async (req, res) => {
  try {
    console.log("GET Keyin SERVICE");
    const services = await axios
      .post(
        process.env.OWS_URL,
        {
          service: "productdetailnew",
          username: process.env.OWS_USERNAME,
          password: process.env.OWS_PASSWORD,
        },
        config_agent
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (services) {
      const service = await services.data.detail.keyin.filter(
        (el) => el.status === "Y"
      );
      return res.status(200).send({status: true, data: service});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.callback = async (req, res) => {
  try {
    console.log(req.body);
    const orderid = req.body.ID;
    if (orderid) {
      const order_sot = await OrderSot.findOne({orderid: orderid});
      const data = {...req.body, productid: req.body.productid.toLowerCase()};
      console.log(data);
      const order = await OrderSot.findByIdAndUpdate(order_sot._id, data);
      if (order) {
        return res.status(200).send({status: true, message: "อัพเดตสำเร็จ"});
      } else {
        return res
          .status(400)
          .send({status: false, message: "อัพเดตไม่สำเร็จ"});
      }
    } else {
      return res.status(400).send({message: "ไม่พบเลข ID"});
    }
  } catch (err) {
    console.log(err);
  }
};
