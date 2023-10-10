const mongoose = require('mongoose');
const Joi = require('joi');

const regsimAISPackage = new mongoose.Schema({
    picture: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    detail: { type: String },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    profitbeforeallocate: { type: Number, required: true },
    nbaprofit: { type: Number, required: true },
    plateformprofit: { type: Number, required: true },
    status: { type: String, default: 'เปิดให้บริการ' },
});

const RegsimAISPackage = new mongoose.model('regsimaispackage', regsimAISPackage)

const validate = (data) => {
    const Schema = Joi.object({
        picture: Joi.string().required().label("โปรดใส่รูปภาพแพ็คเกจ"),
        name: Joi.string().required().label("โปรดกรอกชื่อแพ็คเกจ"),
        detail: Joi.string().label("โปรดกรอกรายละเอียด"),
        price: Joi.number().required().label("โปรดกรอกราคา"),
        cost: Joi.number().required().label("โปรดกรอกต้นทุน"),
        profitbeforeallocate: Joi.number().required().label("โปรกรอกกำไรก่อนจัดสรรค์"),
        nbaprofit: Joi.number().required().label("โปรดกรอกกไรจัดสรรค์ของบริษัท"),
        plateformprofit: Joi.number().required().label("โปรดกรอกกำไรจัดสรรค์ของ plateform"),
    })
    return Schema.validate(data);
}

module.exports = { RegsimAISPackage, validate }