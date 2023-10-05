const mongoose = require('mongoose');
const Joi = require('joi');

const detachPackage = new mongoose.Schema({
    picture: { type: String, require: true },
    name: { type: String, require: true, unique: true },
    detail: { type: String },
    price: { type: Number, require: true },
    cost: { type: Number, require: true },
    profitbeforeallocate: { type: Number, require: true },
    nbaprofit: { type: Number, require: true },
    plateformprofit: { type: Number, require: true },
    status: { type: String, default: 'เปิดให้บริการ' },
});

const DetachPackage = new mongoose.model("detachPackage", detachPackage)

const validate = (data) => {
    const Schema = Joi.object({
        picture: Joi.string().required().label("โปรดใส่รูปภาพแพ็คเกจ"),
        name: Joi.string().required().label("โปรดกรอกชื่อแพ็คเกจ"),
        detail: Joi.string().label("โปรดกรอกรายละเอียด"),
        price: Joi.string().required().label("โปรดกรอกราคา"),
        cost: Joi.string().required().label("โปรดกรอกต้นทุน"),
        profitbeforeallocate: Joi.string().required().label("โปรดกรอกกำไรก่อนจัดสรรค์"),
        nbaprofit: Joi.string().required().label("โปรดกรอกกำไรจัดสรรค์ของบริษัท"),
        plateformprofit: Joi.string().required().label("โปรดกรอกกำไรจัดสรรค์ของ platform"),
    });
    return Schema.validate(data);
}

module.exports = { DetachPackage, validate }