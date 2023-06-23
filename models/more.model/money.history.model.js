const mongoose = require("mongoose");
const Joi = require("joi");
const dayjs = require("dayjs");

const MoneyHistorySchema = new mongoose.Schema({
    shop_id : {type : String, required : false, default: ''},
    partner_id : {type: String, required: true},
    name : {type: String, required: true},
    type : {type: String, required: true},
    amount : {type: Number, required: true},
    detail : {type: String, default : "ไม่มี"},
    timestamp : {type: Date, required : false, default: dayjs(Date.now()).format()}
})

const MoneyHistory = mongoose.model("money_history", MoneyHistorySchema);

const validate = (data)=>{
    const schema = Joi.object({
        shop_id : Joi.string().default(''),
        partner_id : Joi.string().required().label("ไม่พบไอดีพาร์ทเนอร์"),
        name : Joi.string().required().label("ไม่พบชื่อรายการ"),
        type : Joi.string().required().label("ไม่พบประเภทรายการ"),
        amount : Joi.number().required().label("ไม่พบจำนวน"),
        detail : Joi.string().default("ไม่มี"),
        timestamp : Joi.date().default(dayjs(Date.now()).format())
    })
    return schema.validate(data);
}

module.exports = {MoneyHistory, validate}