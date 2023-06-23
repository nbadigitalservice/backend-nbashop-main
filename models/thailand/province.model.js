const mongoose = require('mongoose');
const Joi = require('joi');

const ApiProvinceSchema = new mongoose.Schema({
    id : {type: Number, required: true},
    name_th : {type: String, required: true},
    name_en : {type: String, required: true},
    geography_id : {type: Number, required: false, default: 0},
    created_at : {type: Date, required: false, default: new Date()},
    updated_at: {type:Date, required: false, default: new Date()},
});

const ApiProvince = mongoose.model('api_province', ApiProvinceSchema);

const validate = (data)=>{
    const schema = Joi.object({
        id : Joi.number().required().label('ไม่พบไอดี'),
        name_th : Joi.string().required().label('ไม่พบชื่อภาษาไทย'),
        name_en : Joi.string().required().label('ไม่พบชื่อภาษอังกฤษ'),
        geography_id : Joi.number().default(0),
        created_at : Joi.date().default(new Date()),
        updated_at : Joi.date().default(new Date())
    });
    return schema.validate(data);
}

module.exports = {ApiProvince, validate};