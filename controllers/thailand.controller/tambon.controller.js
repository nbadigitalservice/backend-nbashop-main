const Joi = require('joi');
const {ApiTambon, validate} = require('../../models/thailand/tambon.model');
const { ApiAmphure } = require('../../models/thailand/amphure.model');

exports.getAll = async (req, res)=>{
    try{
        const tambon = await ApiTambon.find();
        if(tambon){
            return res.status(200).send(tambon);
        }else{
            return res.status(400).send({message: 'ดึงข้อมูลตำบลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลา'})
    }
}

exports.getById = async (req, res)=>{
    try{
        const id = req.params.id; 
        const tambon = await ApiTambon.findOne({id: id});
        if(tambon){
            return res.status(200).send(tambon);
        }else{
            return res.status(400).send({message: 'ดึงข้อมูลตำบลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByAmphureId = async (req, res)=>{
    try{
        const amphure_id = req.params.amphure_id;
        const tambon = await ApiTambon.find({amphure_id: amphure_id});
        if(tambon){
            return res.status(200).send(tambon);
        }else{
            return res.status(400).send({message: 'ดึงข้อมูลตำบลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.addTambon = async(req, res)=>{
    try{
        const vali = (data)=>{
            const schema = Joi.object({
                name_th : Joi.string().required().label('ไม่พบชื่อตำบล ภาษาไทย'),
                name_en : Joi.string().required().label('ไม่พบชื่อตำบล ภาษาอังกฤษ'),
                zip_code : Joi.number().required().label('ไม่พบรหัสไปรษณีย์'),
                amphure_id : Joi.number().required().label('ไม่พบไอดีอำเภอ')
            });
            return schema.validate(data);
        }
        //check error
        const {error} = vali(req.body);
        if(error){
            return res.status(400).send({status: false,message: error.details[0].message})
        }

        //check amphure_id in database or not
        const check_amphure_id = await ApiAmphure.findOne({id : req.body.amphure_id});
        if(!check_amphure_id){
            return res.status(400).send({message: 'ไม่มีไอดีอำเภอนี้ในฐานข้อมูล'})
        }
        //check tambon name have already or not
        const check_name_th = await ApiTambon.findOne({name_th: req.body.name_th, amphure_id: req.body.amphure_id});
        if(check_name_th){
            return res.status(400).send({status: false, message: 'ชื่อตำบลนี้มีในอำเภอนี้เรียบร้อยแล้ว'})
        }
        //generate new id tambon
        const id = await generateTambonId(req.body.amphure_id);
        console.log('-- เพิ่มตำบลใหม่ ---');
        const tambon = await ApiTambon.create({id: id, ...req.body});
        if(tambon){
            console.log('ตำบลใหม่ : ', tambon);
            console.log('-- สำเร็จ --')
            return res.status(201).send({status: true, message: 'เพิ่มตำบลเรียบร้อยสำเร็จ', data: tambon})
        }else{
            return res.status(400).send({status: false, message: 'เพิ่มตำบลไม่สำเร็จ'})
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.delTambon = async(req, res)=>{
    try{
        const id = req.params.id;
        const tambon = await ApiTambon.findOneAndDelete({id: id});
        if(tambon){
            return res.status(200).send({status: true, message: 'ลบตำบลเรียบร้อยแล้ว'})
        }else{
            return res.status(400).send({status: false, message: 'ลบตำบลไม่สำเร็๗'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.updateTambon = async(req, res)=>{
    try{
        const vali = (data)=>{
            const schema = Joi.object({
                name_th : Joi.string().required().label('ไม่พบชื่อตำบลภาษาไทย'),
                name_en : Joi.string().required().label('ไม่พบชื่อตำบลภาษาอังกฤษ'),
                zip_code : Joi.number().required().label('ไม่พบรหัสไปรษณีย์')
            })
            return schema.validate(data);
        }

        const id = req.params.id;
        const {error} = vali(req.body);
        if(error){
            return res.status(400).send({status: false, message: error.details[0].message})
        }

        const tambon = await ApiTambon.findOneAndUpdate({id:id},req.body);
        if(tambon){
            return res.status(200).send({status: true, message: 'อัพเดตตำบลเรียบร้อยแล้ว'})
        }else{
            return res.status(400).send({status: false, message: 'อัพเดตตำบลไม่สำเร็จ'})
        }

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

async function generateTambonId(amphure_id){
    const maxValue = await ApiTambon.find({amphure_id: amphure_id}).sort("-id").limit(1);
    console.log(maxValue[0].id);

    return maxValue[0].id+1;
}