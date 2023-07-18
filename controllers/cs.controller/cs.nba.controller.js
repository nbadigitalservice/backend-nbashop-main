const dayjs = require("dayjs");
const axios = require('axios');
const {OrderNBA} = require('../../models/cs.model/order.nba.model');
const {OrderCs} = require('../../models/cs.model/order.cs.model');
const jwt = require('jsonwebtoken');

exports.create = async(req, res)=>{
    try{
        //get user
       

        console.log('body',req.body);

        const orderid = await genOrderId();
        const invoice = await invoiceNumber(req.body.shop_id, req.body.timestamp);
        const order_nba = {
            orderid : orderid,
            invoice : invoice,
            productid : req.body.productid,
            productname : req.body.productname,
            detail: req.body.detail.note,
            ref1: req.body.detail.ref1,
            ref2 : req.body.detail.ref2,
            charge: req.body.charge,
            price : req.body.price,
            image: req.body.image,
            date : dayjs(req.body.timestamp).format('YYYY-MM-DD'),
            time : dayjs(req.body.timestamp).format('HH:mm:ss'),
            created_by: {name:req.body.employee,phone:req.body.mobile}
        }
        const order_cs = {
            ...req.body,company: "NBA",
            invoice : invoice,
            detail : {...order_nba},
            created_by: req.body.employee
        }
        console.log(order_nba);
        console.log(order_cs);
        //เพิ่มข้อมูลเข้า order_nba
        const nba = await OrderNBA.create(order_nba);
        if(nba){
            const cs = await OrderCs.create(order_cs);
            if(cs){
                return res.status(200).send({status: true, data: cs})
            }
        }


        //เพิ่มข้อมูลเข้า order_cs
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
    }
}

exports.getAll = async(req, res)=>{
    try{
        const order = await OrderNBA.find();
        if(order){
            return res.status(200).send({status: true, data: order});
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById =async(req, res)=>{
    try{
        const id = req.params.id;
        const order = await OrderNBA.findById(id);
        if(order){
            return res.status(200).send({status: true, data: order})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'});
    }
}

exports.getByOrderId = async(req, res)=>{
    try{
        const orderid = req.params.orderid;
        const order = await OrderNBA.findOne({orderid: orderid});
        if(order){
            return res.status(200).send({status: true, data: order})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByInvoice = async(req,res)=>{
    try{
        const invoice = req.params.invoice;
        const order = await OrderNBA.findOne({invoice: invoice})
        if(order){
            return res.status(200).send({status: true, data: order})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

exports.update=async(req, res)=>{
    try{
        const id = req.params.id;

         //get user
         const token = req.headers['auth-token'].replace(/^Bearer\s+/, "");
         const decoded = await jwt.verify(token,process.env.JWTPRIVATEKEY);
         if(!decoded){
             return res.status(401).send({message:'ไม่สามารถเข้าถึงได้'});
         }

        const order = await OrderNBA.findByIdAndUpdate(id,{...req.body,updated_by:decoded.name});
        if(order){
            return res.status(200).send({status: true, message: 'แก้ไขข้อมูลเรียบร้อยแล้ว'})
        }else{
            return res.status(400).send({status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}


//สร้างorder รายการ
async function genOrderId(){
    const order_nba = await OrderNBA.find();
    let orderid = 0;
    if(order_nba.length !==0){
        let num = 0;
        do{
            num = num+1;
            check = await OrderNBA.find({orderid: num});
            if(check){
                orderid = num;
            }
        }while(check.length !==0);
    }else{
        orderid = orderid+1;
    }
    return orderid;
}

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


