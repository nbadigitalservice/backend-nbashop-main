const mongoose = require('mongoose');
const Joi = require('joi');

const ServiceNBASchema = new mongoose.Schema({
    productid : {type:String, required: true},
    productname : {type:String, required: true},
    alert_text : {type:String, required: false, default : ""},
    warning_text: {type:String, required: false, default : ""},
    template1: {type: String, required: false, default : ""},
    template2: {type: String, required: false, default : ""},
    charge : {type: Number, required: true},
    cost_nba : {type:Number, required: true},
    cost_shop : {type: Number, required: true},
    status: {type: Boolean, required: false, default: true}
})

const ServiceNBA = mongoose.model('service_nba', ServiceNBASchema);

const validate_service_nba = (data)=>{
    const schema = Joi.object({
        productname : Joi.string().required().label('กรุณากรอกชื่อบริการ'),
        alert_text : Joi.string().default(''),
        warning_text : Joi.string().default(''),
        template1 : Joi.string().default(''),
        template2 : Joi.string().default(''),
        charge: Joi.number().required().label('กรุณากรอกค่าธรรมเนียม'),
        cost_nba : Joi.number().required().label('กรุณากรอกกำไรเอ็นบีเอ'),
        cost_shop : Joi.number().required().label('กรุณากรอกยอดที่ shop ได้'),
        status : Joi.boolean().default(true)
    })
    return schema.validate(data);
}

module.exports = {ServiceNBA, validate_service_nba}