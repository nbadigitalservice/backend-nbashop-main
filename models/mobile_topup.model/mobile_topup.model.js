const mongoose = require('mongoose');
const Joi = require('joi');

const MobileTopupSchema = new mongoose.Schema({
    shop_id : {type: String, required: true},
    invoice : {type: String, required: false, default:''},
    company : {type: String, required: false, default:''},
    payment_type : {type: String, required: true},
    type: {type: String, required: true},               //เติมเงินมือถือ, บัตรเติมเงิน
    mobile : {type : String, required: true},           //เบอร์โทร
    price : {type: Number, required: true},             //ยอดที่เติม
    charge : {type: Number, required: true},            //ค่าธรรมเนียม
    receive : {type : Number, required: true},          //ยอดเงินที่รับ
    profit_nba : {type: Number, required: true},        //กำไรที่ nba จะได้รับ
    profit_shop : {type: Number, required: true},       //กำไรที่ร้านค้าจะได้รับ
    cost : {type: Number,required: true},               //จำนวนยอดเงินที่หักจากกระเป๋า partner
    employee : {type: String, required: true},          //เจ้าหน้าที่ร้านค้าทำรายการ
    transid : {type:String, required: false, default:''},          
    timestamp: {type: Date, required: true},
    detail: {type: Object, required: false},
})

const MobileTopup = mongoose.model('mobile_topup', MobileTopupSchema);
const validate_mobile_topup = (data)=>{
    const schema = Joi.object({
        shop_id : Joi.string().required().label('ไม่พบ shop_id'),
        invoice : Joi.string().default(''),
        company : Joi.string().default(''),
        payment_type : Joi.string().required().label('ไม่พบประเภทการชำระเงิน'),
        type: Joi.string().required().label('ไม่พบประเภทการเติมเงิน'),
        mobile : Joi.string().required().label('ไม่พบเบอร์โทร'),
        price : Joi.number().required().label('ไม่พบจำนวนที่เติม'),
        charge: Joi.number().required().label('ไม่พบค่าธรรมเนียม'),
        receive : Joi.number().required().label('ไม่พบจำนวนเงินที่รับ'),
        profit_nba : Joi.number().required().label('ไม่พบกำไร nba'),
        profit_shop : Joi.number().required().label('ไม่พบกำไรร้านค้า'),
        cost : Joi.number().required().label('ไม่พบยอดที่หักจากกระเป๋า'),
        employee : Joi.string().required().label('ไม่พบเจ้าหน้าที่ทำรายการ'),
        transid : Joi.string().default(''),
        timestamp: Joi.date().required().label('ไม่พบวันที่ทำรายการ'),
        detail : Joi.object()
    });
    return schema.validate(data);
}

module.exports = {MobileTopup, validate_mobile_topup};