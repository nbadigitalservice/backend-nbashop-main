const {PercentCs, validate } = require("../../models/cs.model/percent.model")

exports.create = async(req, res) => {
    try{
        const {error} = validate(req.body);
        const code = req.body.code;
        if(error){
            return res.status(400).send({status: false, message: error.details[0].message})
        }
        const check_code = await PercentCs.findOne({code});
        if(check_code){
            return res.status(400).send({status: false, message : "รหัสนี้มีเรียบร้อยแล้ว"})
        }
        console.log(req.body);
        const percent = await PercentCs.create(req.body);
        if(percent){
            return res.status(201).send({status: true, data: percent})
        }else{
            return res.status(400).send({status: false, message: "เพิ่มข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        const percent = await PercentCs.findByIdAndUpdate(id, req.body);
        if(percent){
            return res.status(200).send({status: true, message: "แก้ไขข้อมูลสำเร็จ"})
        }else{
            return res.status(500).send({status: false, message: "แก้ไขข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

exports.getAll = async(req, res)=>{
    try{
        const percent = await PercentCs.find();
        if(percent){
            return res.status(200).send({status: true, data: percent})
        }else{
            return res.status(400).send({status: false, message: 'มีบางอย่างผิดพลาด'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const percent = await PercentCs.findById(id);
        if(percent){
            return res.status(200).send({status: true, data: percent});
        }else{
            return res.status(400).sen({status: false, message: 'ตึงข้อมูลผิดพลาด'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}