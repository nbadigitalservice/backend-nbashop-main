const {ProductExpress, validate} = require("../../models/express.model/product.express.model");

exports.create = async(req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({message : error.details[0].message, status : false})
        }
        const product = await ProductExpress.create(req.body);
        if(product){
            return res.status(201).send({status : true, message : "เพิ่มข้อมูลสำเร็จ", result:product});
        }else{
            return res.status(400).send({status : false, message: "เพิ่มข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        const product = await ProductExpress.findByIdAndUpdate(id, req.body);
        if(product){
            return res.status(200).send({status: true, message : "แก้ไขข้อมูลสำเร็จ", result: {_id:product._id ,shop_id: product.shop_id , ...req.body}})
        }else{
            return res.status(400).send({status: false, message: "แก้ไขข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        return res.status(500).send({message: err._message});
    }
}

exports.getAll = async(req, res)=>{
    try{
        const product = await ProductExpress.find();
        if(product){
            return res.status(200).send({status : true, data : product})
        }else{
            return res.status(400).send({status : false, message : "ดึงข้อมูลไม่สำเร็จ" })
        }
    }catch(err){
        return res.status(500).send({message: err._message});
    }
}

exports.getById =async(req, res)=>{
    try{
        const id = req.params.id;
        const product = await ProductExpress.findById(id);
        if(product){
            return res.status(200).send({status: true, data : product})
        }else{
            return res.status(400).send({status: false, message : "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        return res.status(500).send({message: err._message});
    }
}

exports.getByShopId = async(req, res)=>{
    try{
        const shop_id = req.params.shop_id;
        const product = await ProductExpress.find({shop_id : shop_id});
        if(product){
            return res.status(200).send({status: true, data: product})
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        return res.status(500).send({message: err._message});
    }
}

exports.delete = async(req, res)=>{
    try{
        const id = req.params.id;
        const product = await ProductExpress.findByIdAndDelete(id);
        if(product){
            return res.status(200).send({status: true, message :"ลบข้อมูลสำเร็จ"});
        }else{
            return res.status(400).send({status: false, message : "ลบข้อมูลไม่สำเร็จ"});
        }
    }catch(err){
        return res.status(500).send({message: err._message});
    }
}
