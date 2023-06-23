const {BoxStandard , validate } = require("../../models/express.model/box.standard.model")

exports.create = async (req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({status: false, message : error.details[0].message});
        }
        const box = await BoxStandard.create(req.body);
        if(box){
            return res.status(201).send({status: true, data : box});
        }else{
            return res.status(400).send({status : false, message: "สร้างรายการไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message})
    }
}

exports.update = async (req, res)=>{
    try{
        const id = req.params.id;
        const box = await BoxStandard.findByIdAndUpdate(id, req.body);
        if(box){
            return res.status(200).send({status: true ,message: "แก้ไขข้อมูลสำเร็จ"})
        }else{
            return res.status(400).send({status: false, message : "แก้ไขข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message})
    }
}

exports.delete = async(req, res)=>{
    try{
        const id = req.params.id;
        const box = await BoxStandard.findByIdAndDelete(id);
        if(box){
            return res.status(200).send({status: true, message: "ลบข้อมูลสำเร็จ"})
        }else{
            return res.status(400).send({status: false, message: "ลบข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message})
    }
}

exports.getAll = async(req, res)=>{
    try{
        const box = await BoxStandard.find();
        if(box){
            return res.status(200).send({status: true, data : box})
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : err._message})
    }
}

exports.getById = async(req, res)=>{
    try{ 
        const id = req.params.id;
        const box = await BoxStandard.findById(id);
        if(box){
            return res.status(200).send({status: true, data: box});
        }else{
            return res.status(400).send({status: false, message: "ไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : err._message})
    }
}

