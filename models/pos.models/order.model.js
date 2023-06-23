const mongoose = require("mongoose");
const Joi = require("joi");

const OrderSchema = new mongoose.Schema({
    ponba_id : {type:String, required: true},
    dealer_id : {type:String, default: "ไม่มี"},
    tracking_code : {type:String, default : "ไม่มี"},
    tracking_number : {type: String, default : "ไม่มี"},
    barcode : {type:String, required: true},
    shop_id : {type: String, default : "ไม่มี"},
    product_detail : {type: Array, required: true},
    store_id : {type: String , default: "ไม่มี"},
    status : {type: Array, required : true}
});

const Order = mongoose.model("order", OrderSchema);
const validate = (data)=>{
    const schema = Joi.object({
        ponba_id : Joi.string().required().label("กรุณากรอก Preorder NBA"),
        dealer_id : Joi.string().default("ไม่มี"),
        tracking_code : Joi.string().default("ไม่มี"),
        trakcing_number : Joi.string().default("ไม่มี"),
        barcode : Joi.string().required().label("กรุณากรอกบาร์โค้ดใบส่งสินค้า"),
        shop_id : Joi.string().default("ไม่มี"),
        product_detail : Joi.array().required().label("กรุณาเพิ่มรายการสินค้าที่จะได้รับ"),
        store_id : Joi.string().default("ไม่มี"),
        status : Joi.array()
    });
    return schema.validate(data);
}

module.exports = {Order, validate};