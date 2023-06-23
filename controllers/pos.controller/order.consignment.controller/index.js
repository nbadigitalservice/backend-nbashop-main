const {OrderConsignment, validate} = require('../../../models/pos.models/order.consignment.model')

//สร้างรายการส่ง
exports.create = async(req,res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({status: false, message: error.details[0].message})
        }
        //check Barcode ซ้ำ
        const check_barcode = await OrderConsignment.findOne({barcode : req.body.barcode})
        if(check_barcode){
            return res.status(400).send({status: false, message: 'บาร์โค้ดนี้มีในฐานข้อมูลเรียบร้อยแล้ว'})
        }
        const order_consignment = await OrderConsignment.create(req.body);
        if(order_consignment){
            return res.status(201).send({status: true, message: 'สร้างรายการส่งของสำเร็จ', data: order_consignment})
        }else{
            return res.status(400).send({status: false, message: 'สร้างรายการไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getAll = async(req, res)=>{
    try{
        const order_consignment = await OrderConsignment.find();
        if(order_consignment){
            return res.status(200).send({status: true, data: order_consignment})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const order_consignment = await OrderConsignment.findById(id);
        if(order_consignment){
            return res.status(200).send({status: true, data: order_consignment})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByShopId = async(req,res)=>{
    try{
        const shop_id = req.params.shop_id;
        const order_consignment = await OrderConsignment.find({shop_id : shop_id});
        if(order_consignment){
            return res.status(200).send({status: true, data: order_consignment})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByDealerId = async(req, res)=>{
    try{
        const dealer_id = req.params.dealer_id;
        const order_consignment = await OrderConsignment.find({dealer_id: dealer_id});
        if(order_consignment){
            return res.status(200).send({status: true, data: order_consignment})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByPreorderConsignmentId = async(req,res)=>{
    try{
        const pocon_id = req.params.pocon_id;
        const order_consignment = await OrderConsignment.find({pocon_id: pocon_id})
        if(order_consignment){
            return res.status(200).send({status: true, data: order_consignment})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.update = async(req,res)=>{
    try{
        const id = req.params.id;
        const order_consignment = await OrderConsignment.findByIdAndUpdate(id, req.body);
        if(order_consignment){
            return res.status(200).send({status: true, message : 'แก้ไขข้อมูลสำเร็จ'})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}