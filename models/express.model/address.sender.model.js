// ที่อยู่ผู้
const mongoose = require("mongoose");
const Joi = require("joi");

const AddressSenderSchema = new mongoose.Schema({
    shop_id : {type: String, required: true},
    name : {type: String, required: true},
    tel : {type: String, required: true},
    address : {type: String, required : true},
    district : {type: String, required: true}, //ตำบล
    state : {type: String, required : true}, // อำเภอ
    province : {type: String,required : true}, //จังหวัด
    postcode : {type: String, required : true}, //รหัส ปณ.
})

const AddressSender = mongoose.model('address_sender', AddressSenderSchema);

const validate = (data)=>{
    const schema = Joi.object({
        shop_id : Joi.string().required().label('ไม่พบไอดีร้านค้า'),
        name : Joi.string().required().label('ไม่พบชื่อลูกค้า'),
        tel : Joi.string().required().label('ไม่พบเบอร์โทรศัพท์'),
        address : Joi.string().required().label('ไม่พบที่อยู่'),
        district : Joi.string().required().label('ไม่พบตำบล'),
        state : Joi.string().required().label('ไม่พบอำเภอ'),
        province : Joi.string().required().label('ไม่พบจังหวัด'),
        postcode : Joi.string().required().label('ไม่พบรหัส ปณ.')
    })
    return schema.validate(data);
}

module.exports = {AddressSender, validate}