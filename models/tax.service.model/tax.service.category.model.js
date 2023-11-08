const mongoose = require('mongoose');
const Joi = require('joi');

const taxcategory = new mongoose.Schema({
    picture: {type: String, required: true},
    name: {type: String, required: true, unique: true},
    service_free: {type: Number, required: true}
})

const TaxCategoryModel = new mongoose.model("taxcategory", taxcategory)

const validate = (data) => {
    const Schema = Joi.object({
        picture: Joi.string().required().label("โปรดใส่รูปภาพ"),
        name: Joi.string().required().label("โปรดกรอกชื่อ"),
        service_free: Joi.number().required().label("โปรดกรอกค่าบริการ"),
    })
    return Schema.validate(data);
}

module.exports = { TaxCategoryModel, validate }