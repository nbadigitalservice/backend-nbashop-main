const mongoose = require('mongoose');
const Joi = require('joi');
const PercentCsSchema = new mongoose.Schema({
    code : {type: String, require : true},
    cost_nba : {type: Number , require: true},
    cost_shop : {type: Number , require : true},
    hp_div : {type: Number, require: false, default: 1}
})

const PercentCs = mongoose.model('percent_cs', PercentCsSchema);

const validate = (data)=>{
    const schema = Joi.object({
        code : Joi.string().required().label("กรุณากรอก code service"),
        cost_nba : Joi.number().required().label("กรุณากรอกยอดที่ nba ต้องการ"),
        cost_shop : Joi.number().required().label("กรุณากรอกยอดที่ shop จะได้"),
        hp_div : Joi.number().default(1)
    });
    return schema.validate(data);
}

module.exports = {PercentCs , validate};