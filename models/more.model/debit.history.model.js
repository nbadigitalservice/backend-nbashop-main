const mongoose = require("mongoose");
const Joi = require("joi");

const DebitHistorySchema = new mongoose.Schema({
    shop_id : {type : String, required : true},
    name : {type: String, required: true},
    type : {type: String, required: true}, // เข้า , ออก
    amount : {type: Number, required: true},
    detail : {type: String, default : "ไม่มี"},
    timestamp : {type: Date, required : true}
});

const DebitHistory = mongoose.model("debit_history", DebitHistorySchema);

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
module.exports = {DebitHistory, validate}
