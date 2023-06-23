const dayjs = require("dayjs");
const {
  PreoderConsignment,
  validate,
} = require("../../../models/pos.models/preorder.consignment.model");
const {Shop} = require('../../../models/pos.models/shop.model')
const line = require('../../../lib/line.notify');

exports.create = async (req, res) => {
  try {
    const {error} = validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    //ร้านค้า
    const shop = await Shop.findById(req.body.shop_id);
    if(!shop){
        return res.status(400).send({status: false, message: 'ไม่พบร้านค้าไอดีนี้ในฐานข้อมูล'})
    }
    const invoice = await invoiceNumber(req.body.timestamp);
    console.log('สร้างเลขสั่งสินค้า', invoice);
    const preorder = await PreoderConsignment.create({invoice:invoice,...req.body});
    if(preorder){
        const msg =`
สั่งสินค้าฝากขาย :
ใบสั่งซื้อ : ${invoice}
ร้านค้า : ${shop.shop_name}
สาขา : ${shop.shop_number}
จำนวนสินค้า : ${req.body.detail.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} รายการ
ตรวจสอบได้ที่ : https://shop-admin.nbadigitalservice.com
        `
        await line.linenotify(msg);
        return res.status(201).send({status: true, message: "สร้างรายการสั่งเรียบร้อยแล้ว", data: preorder})
    }else{
        return res.status(500).send({status: false, message: 'สร้างรายการสั่งไม่สำเร็จ'})
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};


exports.getAll = async(req,res)=>{
    try{
        const preorder = await PreoderConsignment.find();
        if(preorder){
            return res.status(200).send({status: true, data: preorder})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req,res)=>{
    try{
        const id = req.params.id;
        const preorder = await PreoderConsignment.findById(id);
        if(preorder){
            return res.status(200).send({status: true, data: preorder})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        const preorder = await PreoderConsignment.findByIdAndUpdate(id, req.body);
        if(preorder){
            return res.status(200).send({status: true, message: 'แก้ไขข้อมูลสำเร็จ'})
        }else{
            return res.status(400).send({status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByShopId = async(req, res)=>{
    try{
        const shop_id = req.params.shop_id;
        const preorder = await PreoderConsignment.find({shop_id:shop_id});
        if(preorder){
            return res.status(200).send({status: true, data: preorder})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

//สร้างเลขใบสั่งซื้อ
async function invoiceNumber(date) {
  const order = await PreoderConsignment.find();
  let invoice_number = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `POC${dayjs(date).format("YYYYMM")}`.padEnd(10, "0") + num;
      check = await PreoderConsignment.find({invoice: data});
      if (check.length === 0) {
        invoice_number =
          `POC${dayjs(date).format("YYYYMM")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_number = `POC${dayjs(date).format("YYYYMM")}`.padEnd(10, "0") + "1";
  }
  return invoice_number;
}


