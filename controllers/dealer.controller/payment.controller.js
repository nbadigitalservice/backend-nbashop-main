const {PaymentDealer, validate} = require('../../models/dealer.model/payment.model')
const dayjs = require('dayjs');
exports.create = async(req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({status: false, message: error.details[0].message})
        }
        const invoice = await invoiceNumber(req.body.timestamp);
        const payment = await PaymentDealer.create({payment_ref: invoice, ...req.body});
        if(payment){
            return res.status(201).send({status: true, data: payment});
        }else{
            return res.status(400).send({status: false, message: 'สร้างรายการไม่สำเร็จ'})
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        const payment = await PaymentDealer.findByIdAndUpdate(id, req.body);
        if(payment){
            return res.status(200).send({status: true, message: 'อัพเดตสำเร็จ'})
        }else{
            return res.status(500).send({status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getAll = async(req, res)=> {
    try{
        const payment = await PaymentDealer.find();
        if(payment){
            return res.status(200).send({status: true, data: payment});
        }else{
            return res.status(400).send({status: false, message :"ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const payment = await PaymentDealer.findById(id);
        if(payment){
            return res.status(200).send({status: true, data: payment});
        }else{
            return res.status(400).send({status: false, message :"ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByDealerId = async(req, res)=>{
    try{
        const dealer_id = req.params.dealer_id;
        const payment = await PaymentDealer.find({dealer_id: dealer_id})
        if(payment){
            return res.status(200).send({status: true, data: payment});
        }else{
            return res.status(400).send({status: false, message :"ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}



//สร้างเลข ทำรายการ payment_ref;
async function invoiceNumber(date) {
    const order = await PaymentDealer.find();
    let invoice_number = null;
    if (order.length !== 0) {
      let data = "";
      let num = 0;
      let check = null;
      do {
        num = num + 1;
        data = `PID${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
        check = await PaymentDealer.find({payment_ref: data});
        if (check.length === 0) {
          invoice_number =
            `PID${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
        }
      } while (check.length !== 0);
    } else {
      invoice_number = `PID${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + "1";
    }
    console.log(invoice_number);
    return invoice_number;
  }
