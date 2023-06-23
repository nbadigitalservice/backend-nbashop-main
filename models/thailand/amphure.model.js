const mongoose = require('mongoose');
const Joi = require('joi');

const ApiAmphureSchema = new mongoose.Schema({
    id : {type: Number, required: true},
    name_th : {type: String, required: true},
    name_en : {type: String, required: true},
    province_id : {type: Number, required: true},
    created_at : {type: Date, required: false, default: new Date()},
    updated_at: {type:Date, required: false, default: new Date()},
});

const ApiAmphure = mongoose.model('api_amphure', ApiAmphureSchema);

const validate = (data)=>{
    const schema = Joi.object({
        id : Joi.number().required().label('ไม่พบไอดี'),
        name_th : Joi.string().required().label('ไม่พบชื่อภาษาไทย'),
        name_en : Joi.string().required().label('ไม่พบชื่อภาษอังกฤษ'),
        province_id : Joi.number().required().label('ไม่พบไอดีจังหวัด'),
        created_at : Joi.date().default(new Date()),
        updated_at : Joi.date().default(new Date())
    });
    return schema.validate(data);
}

module.exports = {ApiAmphure, validate}
