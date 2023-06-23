const {
  PreorderArtwork,
  validate,
} = require("../../models/artwork.model/preorder.artwork.model");
const dayjs = require("dayjs");

exports.create = async (req, res) => {
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({status: false, message:error.details[0].message})
        }
        const invoice = await invoiceNumber();
        const poartwork = await PreorderArtwork.create({invoice: invoice, ...req.body});
        if(poartwork){
            
            return res.status(201).send({status: true, message: 'สร้างรายการสำเร็จ', data: poartwork})
        }else{
            return res.staus(400).send({status: false, message: 'สร้างรายการไม่สำเร็จ'})
        }


    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
};

exports.getAll = async (req, res) => {
    try{
        const poartwork = await PreorderArtwork.find();
        if(poartwork){
            return res.status(200).send({status: true, data: poartwork})
        }else{
            return res.status(400).send({message: 'ดึงข้อมูลไม่สำเร็จ',status: false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
};

exports.findByShopId = async (req, res) => {
    try{
        const shop_id = req.params.shop_id;
        const poartwork = await PreorderArtwork.find({shop_id : shop_id});
        if(poartwork){
            return res.status(200).send({status: true, data: poartwork})
        }else{
            return res.status(400).send({message: 'ดึงข้อมูลไม่สำเร็จ',status: false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
};

exports.getById = async (req, res) => {
    try{
        const id = req.params.id;
        const poartwork = await PreorderArtwork.findById(id);
        if(poartwork){
            return res.status(200).send({status: true, data: poartwork})
        }else{
            return res.status(400).send({message: 'ดึงข้อมูลไม่สำเร็จ',status: false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
};

exports.delete = async (req, res) => {};

exports.update = async (req, res) => {
  try{
    const id = req.params.id;
    const poartwork = await PreorderArtwork.findByIdAndUpdate(id, req.body);
    if(poartwork){
        return res.status(200).send({status: true, message: 'อัพเดตข้อมูลสำเร็จ'})
    }else{
        return res.status(400).send({status: false, message: 'อัพเดตข้อมูลไม่สำเร็จ'})
    }
  }catch(err){
    console.log(err);
    return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
  } 
};

//ค้นหาและสร้างเลข invoice
async function invoiceNumber(date) {
  const order = await PreorderArtwork.find();
  let invoice_number = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `ART${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      check = await PreorderArtwork.find({invoice: data});
      console.log(check);
      if (check.length === 0) {
        invoice_number =
          `ART${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_number = `ART${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + "1";
  }
  console.log(invoice_number);
  return invoice_number;
}
