const mongoose = require("mongoose");
const Joi = require("joi");

const OrderExpressSchema = new mongoose.Schema({
    shop_id : {type: String, required: true},
    platform_tel : { type: String, required: false, default : ''},
    invoice : {type: String, required : false, default: "ไม่มี"},
    invoice_full : {type: String, default : "ไม่มี"},
    total : {type: Number , required: true},
    total_cost : {type: Number, required: false, default: 0},
    receive : {type: Number ,required : true, default : 0},
    payment_type : {type : String, required: true},
    purchase_id : {type : String, required : true, default: "ไม่มี"},
    product : {type: Array, default:[]},
    employee : {type: String, required: true},
    status : {type: Array, default: []},
    timestamp: {type: String, required: true},
})

const OrderExpress = mongoose.model("order_express", OrderExpressSchema);

const validate = (data)=>{
    const schema = Joi.object({
        shop_id : Joi.string().required().label("ไม่พบ shop_id"),
        platform_tel : Joi.string().default(''),
        invoice : Joi.string().default("ไม่มี"),
        invoice_full : Joi.string().default("ไม่มี"),
        total : Joi.number().required().label("ไม่พบยอดรวมใบเสร็จ"),
        total_cost: Joi.number().default(0),
        receive : Joi.number().default(0),
        payment_type : Joi.string().required().label("ประเภทการชำระ"),
        purchase_id : Joi.string().default("ไม่มี"),
        product : Joi.array(),
        employee: Joi.string().required().label("ไม่พบพนักงานทำรายการ"),
        status: Joi.array(),
        timestamp: Joi.string(),
    });
    return schema.validate(data);
}

module.exports = {OrderExpress, validate};