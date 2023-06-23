const mongoose = require("mongoose");
const Joi = require("joi");

const PercentCourierSchema = new mongoose.Schema({
    courier_code : {type : String, required: true},
    percent_nba : {type : Number, required : true},
    percent_shop : {type : Number, required : true},
})

const PercentCourier = mongoose.model("percent_courier", PercentCourierSchema);

const validate = (data)=>{
    const schema = Joi.object({
        courier_code : Joi.string().required().label("กรุณากรอกรหัสขนส่ง"),
        percent_nba : Joi.number().required().label("กรุณากรอกเปอร์เซ็นของบริษัท"),
        percent_shop : Joi.number().required().label("กรุณากรอกเปอร์เซ็นของร้านค้า")
    });
    return schema.validate(data);
}

module.exports = {PercentCourier, validate};