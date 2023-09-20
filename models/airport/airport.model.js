const mongoose = require('mongoose');
const Joi = require('joi');

const ApiAirportSchema = new mongoose.Schema({
    id : {type: Number, required: true},
    province_th : {type: String, required: true},
    province_th : {type: String, required: true},
    IATA : {type: String, required: true},
    name : {type: String, required: true},
    created_at : {type: Date, required: false, default: new Date()},
    updated_at: {type:Date, required: false, default: new Date()},
});

const ApiAirport = mongoose.model('api_aoc', ApiAirportSchema);

const validate = (data)=>{
    const schema = Joi.object({
        id : Joi.number().required().label('ไม่พบไอดี'),
        province_th : Joi.string().required().label('ไม่พบชื่อภาษาไทย'),
        province_th : Joi.string().required().label('ไม่พบชื่อภาษอังกฤษ'),
        IATA : Joi.number().required().label('ไม่พบชื่อย่อ'),
        name : Joi.number().required().label('ไม่พบชื่อ'),
        created_at : Joi.date().default(new Date()),
        updated_at : Joi.date().default(new Date())
    });
    return schema.validate(data);
}

module.exports = {ApiAirport, validate};