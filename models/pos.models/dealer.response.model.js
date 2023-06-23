const mongoose = require("mongoose");
const Joi = require("joi");

const DealerResponseSchema =  new mongoose.Schema({
    product_id : {type:String, required: true},
    product_amount : {type:Number, required: true},
    company_id : {type:String, default: "ไม่มี"},
    dealer_id : {type: String, required: true},
    status: {type:Boolean, default: true},
    barcode : {type:String, default: true},
    tracking_code : {type:String, default: "ไม่มี"},
    tracking_number : {type:String, default: "ไม่มี"},
    timestamp: {type:Array, required : true}
});

const DealerResponse = mongoose.model("dealer_response", DealerResponseSchema);

const validate = (data)=>{
    const schema = Joi.object({
        product_id : Joi.string().required().label("กรุณากรอกรหัสสินค้า"),
        product_amount : Joi.number().required().label("กรุณากรอกจำนวนสินค้า"),
        company_id : Joi.string().default("ไม่มี"),
        dealer_id : Joi.string().required().label("กรุณากรอกไอดีคู่ค้า"),
        status: Joi.boolean().default(true),
        barcode : Joi.string().required().label("กรุณาบาร์โค้ดสินค้า"),
        tracking_code : Joi.string().default("ไม่มี"),
        tracking_number : Joi.string().default("ไม่มี"),
        timestamp : Joi.array().required().label("กรุณากรอกวันเวลา")
    });
    return schema.validate(data);
}
module.exports = {DealerResponse, validate};