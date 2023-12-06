const mongoose = require('mongoose');
const Joi = require('joi');

const TopupWalletSchema = new mongoose.Schema({
    partner_id : {type: String, required: true},
    invoice : {type: String, required: false},
    amount : {type:Number, required: true},
    charge : {type: Number, required: false, default: 0},
    payment_type: {type: String, required: false},
    referenceNo : {type: String, required: false, default:''},
    detail : {type:Object, required: false, default: null},
    company : {type: String, required: false}, //
    employee: {type: String, required: false, default: 'ไม่มี'}, //ชื่อเจ้าหน้าที่ ทำรายการยืนยัน กรณีเป็นการแจ้งเติมเงินแบบแนบสลิป
    status: {type: String, required: false, default: 'รอตรวจสอบ'}, // WAIT > SUCCESS> FAIL
    remark : {type: String, required: false, default : ''},
    timestamp : {type: Date, required : true} //วันที่ทำรายการ
})

const TopupWallet = mongoose.model('topup_wallet', TopupWalletSchema);

const validate_topup_wallet = (data)=>{
    const schema = Joi.object({
        partner_id : Joi.string().required().label('ไม่มี parter_id'),
        invoice : Joi.string(),
        amount : Joi.number().required().label('ไม่มียอดเติมเงิน'),
        charge : Joi.number().default(0),
        payment_type : Joi.string(),
        referenceNo: Joi.string().default(''),
        detail : Joi.object().default(null),
        company : Joi.string(),
        employee : Joi.string().default('ไม่มี'),
        status: Joi.string().label('รอตรวจสอบ'),
        remark : Joi.string().default(''),
    });
    return schema.validate(data);
}

module.exports = {TopupWallet, validate_topup_wallet}