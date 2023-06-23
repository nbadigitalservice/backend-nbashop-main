const {ProductStore, validate} = require("../../../models/pos.models/product.store.model")

exports.create = async(req,res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({message: error.details[0].message, status : false})
        }
        const product = await ProductStore.create(req.body);
        if(product){
            return res.status(201).send({message: "เพิ่มข้อมูลสำเร็จ", status : true});
        }else{
            return res.status(400).send({message : "เพิ่มข้อมูลไม่สำเร็จ" , status: false})
        }

    }catch(err){
        console.log(err);
        return res.status(500).send({message : "มีบางอย่างผิดพลาด"})
    }
}

exports.findAll = async (req, res)=>{
    try{
        const product = await ProductStore.find();
        if(product){
            return res.status(200).send({status : true, data : product});
        }else{
            return res.status(400).send({status : false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
    }
}

exports.getById = async (req, res)=>{
    try{
        const id = req.params._id;
        const product = await ProductStore.findById(id);
        if(product){
            return res.status(200).send({status  :true , data: product})
        }else{
            return res.status(400).send({message : "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : "มีบางอย่างผิดพลาด"})
    }
}


exports.update = async(req, res)=>{
    try{
        const id = req.params._id;
        const product = await ProductStore.findByIdAndUpdate(id, req.body);
        if(product){
            return res.status(200).send({status : true, message: "แก้ไขข้อมูลสำเร็จ"});
        }else{
            return res.status(400).send({status: false, message: "แก้ไขข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : "มีบางอย่างผิดพลาด"})
    }
}

exports.delete = async(req, res)=>{
    try{
        const id = req.params._id;
        const product = await ProductStore.findByIdAndDelete(id);
        if(product){
            return res.status(200).send({status : true, message : "ลบข้อมูลสำเร็จ"})
        }else{
            return res.status(400).send({status : false, message : "ลบข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : "มีบางอย่างผิดพลาด"});
    }
}

exports.getByCompanyId = async(req, res)=>{
    try{
        const company_id = req.params.company_id;
        const product = await ProductStore.find({productCompany_id : company_id});
        if(product){
            return res.status(200).send({status: true, data: product});
        }else{
            return res.status(500).send({status: false,message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({massage: "มีบางอย่างผิดพลาด"})
    }
}
