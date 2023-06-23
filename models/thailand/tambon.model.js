const mongoose = require('mongoose');
const Joi = require('joi');

const ApiTambonSchema = new mongoose.Schema({
    id : {type: Number, required: true},
    zip_code : {type: Number, required: true},
    name_th : {type: String, required: true},
    name_en : {type: String, required: true},
    amphure_id : {type: Number, required: true},
    created_at : {type: Date, required: false, default: new Date()},
    updated_at: {type:Date, required: false, default: new Date()},
});

const ApiTambon = mongoose.model('api_tambon', ApiTambonSchema);

const validate = (data)=>{
    const schema = Joi.object({
        id : Joi.number().required().label('ไม่พบไอดี'),
        zip_code : Joi.number().required().label('ไม่พบรหัสไปรษณีย์'),
        name_th : Joi.string().required().label('ไม่พบชื่อภาษาไทย'),
        name_en : Joi.string().required().label('ไม่พบชื่อภาษอังกฤษ'),
        amphure_id : Joi.number().required().label('ไม่พบไอดีอำเภอ'),
        created_at : Joi.date().default(new Date()),
        updated_at : Joi.date().default(new Date())
    });
    return schema.validate(data);
}

module.exports = {ApiTambon, validate}
