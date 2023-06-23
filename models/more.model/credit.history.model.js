const mongoose = require("mongoose");
const Joi = require("joi");

const CreditHistorySchema = new mongoose.Schema({
    shop_id : {type : String, required : true},
    name : {type: String, required: true},
    type : {type: String, required: true}, //เครติดเข้า, เครติดออก
    amount : {type: Number, required: true},
    detail : {type: String, default : "ไม่มี"},
    timestamp : {type: Date, required : true}
})

const CreditHistory = mongoose.model("credit_history", CreditHistorySchema);

const validate = (data)=>{
    const schema = Joi.object({
        shop_id : Joi.string().required().label("ไม่พบไอดีร้านค้า"),
        name : Joi.string().required().label("ไม่พบชื่อรายการ"),
        type : Joi.string().required().label("ไม่พบประเภทรายการ"),
        amount : Joi.number().required().label("ไม่พบจำนวน"),
        detail : Joi.string().default("ไม่มี"),
        timestamp : Joi.date()
    })
    return schema.validate(data);
}

module.exports = {CreditHistory, validate}