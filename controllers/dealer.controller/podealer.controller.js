const {
  PreorderDealer,
  validate,
} = require("../../models/dealer.model/podealer.model");
const dayjs = require('dayjs');
exports.getAll = async (req, res) => {
  try {
    const podealer = await PreorderDealer.find();
    if (podealer) {
      return res.status(200).send({status: true, data: podealer});
    } else {
      return res
        .status(400)
        .send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const podealer = await PreorderDealer.findById(id);
    if (podealer) {
      return res.status(200).send({status: true, data: podealer});
    } else {
      return res
        .status(400)
        .send({status: true, message: "ดึงข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.create = async (req, res) => {
  try {
    const {error} = validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    const invoice = await invoiceNumber(req.body.timestamp);
    const podealer = await PreorderDealer.create({
      invoice: invoice,
      ...req.body,
    });
    if (podealer) {
      return res.status(201).send({status: true, data: podealer});
    } else {
      return res
        .status(400)
        .send({status: false, message: "เพิ่มข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const podealer = await PreorderDealer.findByIdAndUpdate(id, req.body);
    if (podealer) {
      return res.status(200).send({status: true, message: "แก้ไขข้อมูลสำเร็จ"});
    } else {
      return res
        .status(400)
        .send({status: false, message: "แก้ไขข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.getByDealerId = async (req, res)=>{
    try{
        const dealer_id = req.params.dealer_id;
        const podealer = await PreorderDealer.find({dealer_id : dealer_id});
        if(podealer){
            return res.status(200).send({status: true, data: podealer});
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByInvoice = async (req, res)=>{
    try{
        const invoice = req.params.invoice;
        const podealer = await PreorderDealer.find({invoice : invoice});
        if(podealer){
            return res.status(200).send({status: true, data: podealer});
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

//ค้นหาและสร้างเลข invoice
async function invoiceNumber(date) {
  const order = await PreorderDealer.find();
  let invoice_number = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `POD${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      check = await PreorderDealer.find({invoice: data});
      if (check.length === 0) {
        invoice_number =
          `POD${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_number = `POD${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + "1";
  }
  console.log(invoice_number);
  return invoice_number;
}
