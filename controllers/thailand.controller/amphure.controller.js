const {ApiAmphure, validate} = require('../../models/thailand/amphure.model');


exports.getAll = async (req, res)=>{
    try{
        const amphure = await ApiAmphure.find();
        if(amphure){
            return res.status(200).send(amphure);
        }else{
            return res.status(400).send({message: 'ดึงข้อมูลอำเภอไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async (req, res)=>{
    try{
        const id = req.params.id;
        const amphure = await ApiAmphure.findOne({id:id});
        if(amphure){
            return res.status(200).send(amphure);
        }else{
            return res.status(400).send({message: 'ดึงข้อมูลอำเภอไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByProvinceId =async (req, res)=>{
    try{
        const province_id = req.params.province_id;
        const amphure = await ApiAmphure.find({province_id: province_id});
        if(amphure){
            return res.status(200).send(amphure);
        }else{
            return res.status(400).send({message: 'ดึงข้อมูลอำเภอไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}