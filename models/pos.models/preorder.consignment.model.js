const mongoose = require("mongoose");
const Joi = require("joi");
const PreoderConsignmentSchema = new mongoose.Schema({
    invoice : {type: String, required: false, default: ''},
    shop_id : {type: String, required: true},
    detail : {type:Array, required: true},
    status: {type: Array, required: true},
    timestamp : {type: Date, required: true},
    remark : {type:String, required: false, default: ''}
})

const PreoderConsignment = mongoose.model('preoder_consignment', PreoderConsignmentSchema);

const validate = (data)=>{
    const schema = Joi.object({
        invoice : Joi.string().default(''),
        shop_id : Joi.string().required().label('ไม่พบไอดีร้านค้าที่สั่ง'),
        detail : Joi.array().required().label('ไม่พบรายการสั่ง'),
        status: Joi.array().required().label('ไม่พบรายการสถานะ'),
        timestamp: Joi.date().required().label('ไม่มีวันเวลาทำรายการ'),
        remark : Joi.string().default('')
    });
    return schema.validate(data);
}

module.exports = {PreoderConsignment, validate};