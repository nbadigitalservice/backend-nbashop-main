const mongoose = require('mongoose');
const Joi = require('joi');

const taxpackage = new mongoose.Schema({
    categoryid: {type: String, required: true},
    picture: {type: String, required: true},
    name: {type: String, required: true, unique: true},
    detail: {type: String},
    price: {type: Number},
    cost: {type: Number},
    profitbeforeallocate: {type: Number},
    nbaprofit: {type: Number},
    plateformprofit: {type: Number},
    status: {type: String, default: 'เปิดให้บริการ'},
})

const TaxPackageModel = new mongoose.model("taxpackage", taxpackage)

const validate = (data) => {
    const Schema = Joi.object({
        code: Joi.string().required().label("โปรดใส่โค๊ดแพ็คเกจ"), 
        picture: Joi.string().required().label("โปรดใส่รูปภาพแพ็คเกจ"),
        name: Joi.string().required().label("โปรดกรอกชื่อแพ็คเกจ"),
        detail: Joi.string().label("โปรดกรอกรายละเอียด"),
        price: Joi.number().required().allow("").label("โปรดกรอกราคา"),
        cost: Joi.number().required().allow("").label("โปรดกรอกต้นทุน"),
        profitbeforeallocate: Joi.number().required().allow("").label("โปรกรอกกำไรก่อนจัดสรรค์"),
        nbaprofit: Joi.number().required().allow("").label("โปรดกรอกกไรจัดสรรค์ของบริษัท"),
        plateformprofit: Joi.number().required().allow("").label("โปรดกรอกกำไรจัดสรรค์ของ plateform"),
    })
    return Schema.validate(data);
}

module.exports = { TaxPackageModel, validate }