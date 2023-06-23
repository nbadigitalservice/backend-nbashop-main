const {OrderExpress, validate} = require("../../models/express.model/order.express.model");
const {BookingParcel, validate_parcel }= require("../../models/express.model/booking.parcel.model");
const dayjs = require("dayjs");
exports.create = async(req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({statue: false, message : error.details[0].message})
        }
        const invoice = await invoiceNumber(req.body.shop_id, req.body.status[0].timestamp);
        const data = {
            ...req.body, invoice : invoice
        };
        const order = await OrderExpress.create(data);
        if(order){
            return res.status(201).send({status : true, message: "สร้างรายการสำเร็จ", result : order});
        }else{
            return res.status(400).send({status: false, message: "สร้างรายการไม่สำเร็จ"});
        }

    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        const order = await OrderExpress.findByIdAndUpdate(id, req.body);
        if(order){
            return res.status(200).send({status: true, message: "แก้ไขข้อมูลเรียบร้อย"});
        }else{
            return res.status(400).send({status: false, message : "แก้ไขข้อมูลไม่สำเร็จ"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : err._message});
    }
}

exports.getByPurchaseId = async(req, res)=>{
    try{
        const {shop_id , purchase_id} = req.body;
        if(shop_id === undefined || purchase_id === undefined){
            return res.status(400).send({status: false,message:"รับข้อมูลไม่ครบถ้วน"});
        }
        console.log('รับข้อมูลครบถ้วน')
        const parcel = await BookingParcel.find({shop_id: shop_id, purchase_id : purchase_id});
        if(parcel){
            return res.status(200).send({status: true, data: parcel});
        }else{
            return res.status(400).send({status: false, message: "ไม่พบข้อมูลที่ต้องการ"});
        }

    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.getById = async(req,res)=>{
    try{
        const id = req.params.id;
        const order = await OrderExpress.findById(id);
        if(order){
            return res.status(200).send({status: true, data : order});
        }else{
            return res.status(400).send({status: false, message : "ไม่มีข้อมูล"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.getByShopId = async(req,res)=>{
    try{
        const shop_id = req.params.shop_id;
        const order = await OrderExpress.find({shop_id: shop_id});
        if(order){
            return res.status(200).send({status: true, data: order})
        }else{
            return res.status(400).send({status: true, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        return res.status(500).send({message: err._message})
    }
}

exports.getAllOrder = async(req, res)=>{
    try{
        const order = await OrderExpress.find();
        if(order){
            return res.status(200).send({status : true, data : order})
        }else{
            return res.status(400).send({status: false, message: 'มีบางอย่างผิดพลาด'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

//ค้นหาและสร้างเลข invoice สำหรับพัสดุ
async function invoiceNumber(shop_id, date){
    const order = await OrderExpress.find({shop_id : shop_id});
    let invoice_number = null;
    if(order.length!==0){
        let data = "";
        let num = 0;
        let check = null;
        do{
            num = num + 1;
            data = `EX${dayjs(date).format('YYYYMM')}`.padEnd(13,"0")+num;
            check =await OrderExpress.find({shop_id : shop_id , invoice: data});
            if(check.length===0){
                invoice_number =`EX${dayjs(date).format('YYYYMM')}`.padEnd(13,"0")+num;
            }
        }while(check.length!==0)
    }else{
        invoice_number = `EX${dayjs(date).format('YYYYMM')}`.padEnd(13,"0")+'1';
    }
    return invoice_number;
}