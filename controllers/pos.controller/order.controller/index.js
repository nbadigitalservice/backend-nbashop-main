const {Order, validate} = require("../../../models/pos.models/order.model");

exports.create = async(req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({message: error.details[0].message, status: false})
        }
        const order = await Order.create(req.body);
        if(order){
            return res.status(201).send({message: "เพิ่มข้อมูลสำเร็จ", status : true, result: order})
        }
    }catch(err){
        console.log(err);
        return res.status(400).send({message : err._message})
    }
}

exports.findAll = async(req,res)=>{
    console.log('find all')
    try{
        const order = await Order.find();
        return res.status(200).send({status: true, data: order});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.findById = async(req,res)=>{
    try{
        const id = req.params.id;
        const order = await Order.findById(id);
        if(order){
            return res.status(200).send({status: true, data: order});
        }else{
            return res.status(400).send({message : "ค้นหาข้อมูลไม่สำเร็จ", status : false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.findByShopId = async(req, res)=>{
    try{
        const shop_id = req.params.shop_id;
        const order = await Order.find({shop_id : shop_id})
        if(order){
            return res.status(200).send({status: true, data: order});
        }else{
            return res.status(400).send({message: "ไม่สำเร็จ", status: false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.findByDealerId = async(req, res)=>{
    try{
        const dealer_id = req.params.dealer_id;
        const order = await Order.find({dealer_id: dealer_id});
        if(order){
            return res.status(200).send({status: true, data: order});
        }else{
            return res.status(400).send({message: "ไม่สำเร็จ", status: false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : err._message});
    }
}
exports.findByPoNbaId = async (req, res)=>{
    try{
        const ponba_id = req.params.ponba_id;
        const order = await Order.find({ponba_id: ponba_id})
        if(order){
            return res.status(200).send({status: true, data: order});
        }else{
            return res.status(400).send({message: "ไม่สำเร็จ", status: false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}
exports.findByStoreId = async(req, res)=>{
    try{
        const store_id = req.params.store_id;
        const order = await Order.find({store_id: store_id});
        if(order){
            return res.status(200).send({status: true, data: order});
        }else{
            return res.status(400).send({message: "ไม่สำเร็จ", status: false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.delete = async(req, res)=>{
    try{
        const id = req.params.id;
        const order = await Order.findByIdAndDelete(id);
        if(order){
            return res.status(200).send({status: true, message : "ลบข้อมูลสำเร็จ"})
        }else{
            return res.status(400).send({status : false, message : "ลบข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        const order = await Order.findByIdAndUpdate(id, req.body);
        if(order){
            return res.status(200).send({status: true, message: "แก้ไขข้อมูลสำเร็จ" })
        }else{
            return res.status(400).send({status: false, message: "แก้ไขข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message})
    }
}


