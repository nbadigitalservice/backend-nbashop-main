const {FunctionMore , validate} = require('../../models/more.model/function.more.model')

exports.create = async(req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({status: false, message: error.details[0].message})
        }
        const check_name = await FunctionMore.findOne({func_name:req.body.func_name});
        if(check_name){
            return res.status(400).send({status: false, message: "ชื่อฟังก์ชั่นนี้มีในระบบเรียบร้อยแล้ว"})
        }
        const function_more = await FunctionMore.create(req.body);

        if(function_more){
            return res.status(201).send({status: true, data: function_more})
        }else{
            return res.status(400).send({status: false, message: "เพิ่มข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

exports.getAll = async(req, res) =>{
    try{
        const function_more = await FunctionMore.find();
        if(function_more){
            return res.status(200).send({status: true, data: function_more})
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id =  req.params.id;
        const function_more = await FunctionMore.findById(id);
        if(function_more){
            return res.status(200).send({status: true, data: function_more})
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

exports.getByFunctionName = async(req, res)=>{
    try{
        const func_name = req.params.func_name;
        const function_more = await FunctionMore.findOne({func_name : func_name});
        if(function_more){
            return res.status(200).send({status: true, data: function_more})
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

exports.update = async(req,res)=>{
    try{
        const id = req.params.id
        const function_more = await FunctionMore.findByIdAndUpdate(id, req.body);
        if(function_more){
            return res.status(200).send({status: true, data: function_more})
        }else{
            return res.status(400).send({status: false, message: "แก้ไขข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}