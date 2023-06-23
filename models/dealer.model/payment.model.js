const mongoose = require("mongoose");
const Joi = require("joi");

const PaymentDealerSchema = new mongoose.Schema({
    payment_ref : {type: String, required: false, default:''},
    dealer_id : {type: String, required: true},
    detail : {type: Array, required: true},
    status : {type :Array, required: true},
    timestamp : {type: Date, required: true},
    slip_image : {type: String, required: false, default: ''}
});

const PaymentDealer = mongoose.model("PaymentDealer", PaymentDealerSchema);

const validate = (data)=>{
    const schema = Joi.object({
        payment_ref : Joi.string().default(''),
        dealer_id : Joi.string().required().label('ไม่พบ dealer id'),
        detail : Joi.array().required().label('ไม่พบรายละเอียดรายการสินค้า'),
        status : Joi.array().required().label('ไม่พบสถานะ และเวลาทำรายการ'),
        timestamp: Joi.date().required().label('ไม่พบเวลาที่ดำเนินการ'),
        slip_image : Joi.string().default('')
    });
    return schema.validate(data);
}
module.exports = {PaymentDealer, validate};