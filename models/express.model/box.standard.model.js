const mongoose = require("mongoose");
const Joi = require('joi');

const BoxStandardSchema = new mongoose.Schema({
    name : {type: String, required: true},
    width : {type: String, required : true},
    length : {type: String, required: true},
    height : {type: String, required : true}
})

const BoxStandard = mongoose.model("box_standard" , BoxStandardSchema);

const validate = (data)=>{
    const schema = Joi.object({
        name : Joi.string().required().label("กรุณากรอกชื่อกล่อง"),
        width: Joi.string().required().label("กรุณากรอกความกว้าง"),
        length : Joi.string().required().label("กรุณากรอกความยาว"),
        height: Joi.string().required().label("กรุณากรอกความสูง")
    })
    return schema.validate(data);
}

module.exports = {BoxStandard , validate}