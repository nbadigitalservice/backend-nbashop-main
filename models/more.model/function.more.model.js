const mongoose = require("mongoose");
const Joi = require('joi');
const FunctionMoreSchema = new mongoose.Schema({
    func_type : {type: String, require: true}, //ประเภทฟังก์ชั่น text, image เท่านั้น
    func_topic : {type: String, require: true}, //ชื่อฟังก์เอาไว้อธิบายหน้า frontend
    func_name : {type: String, require: true}, //เป็นฟังก์กำหนดโดยเฉพาะ
    func_detail : {type: Array, default: []},
    func_discription : {type: String, default : "ไม่มี"}
})

const FunctionMore = mongoose.model('function_more', FunctionMoreSchema);

const validate = (data)=>{
    const schema = Joi.object({
        func_type : Joi.string().required().label("ไมพบประเภทฟังก์ชั่น"),
        func_topic : Joi.string().required().label("ไม่พบหัวข้อของฟังก์ชั่น"),
        func_name : Joi.string().required().label("ไม่พบชื่อฟังก์ชั่น"),
        func_detail : Joi.array().default([]),
        func_discription : Joi.string().default('ไม่มี')
    });
    return schema.validate(data);
}

module.exports = {FunctionMore, validate}