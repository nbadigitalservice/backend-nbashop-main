const mongoose = require("mongoose");
const Joi = require("joi");

const ArtworkListSchema = new mongoose.Schema({
    name : {type:String, required : true}, //ชื่อบริการออกแบบสื่อสิ่งพิมพ์
    type : {type:String, required : true},//ประเภทของสื่อสิ่งพิมพ์
    transpot_fee : {type: Number, required : true}, //ค่าธรรมเนียมขนส่ง
    detail : {type: Array, required : true},
    status: {type: Boolean, required: false, default : true}
});

const ArtworkList = mongoose.model("artwork_list", ArtworkListSchema);

const validate = (data)=>{
    const schema = Joi.object({
        name : Joi.string().required().label("กรุณากรอกชื่อบริการออกแบบสื่อสิ่งพิมพ์"),
        type : Joi.string().required().label("กรุณากรอกประเภทออกแบบสื่อสิ่งพิมพ์"),
        transpot_fee : Joi.number().required().label("กรุณากรอกค่าธรรมเนียมขนส่ง"),
        detail : Joi.array().required().label("กรุณากรอกรายการสื่อสิ่งพิมพ์"),
        status: Joi.boolean().default(true)
    });
    return schema.validate(data);
}

module.exports = {ArtworkList, validate};