const mongoose = require('mongoose');
const Joi = require('joi');

const accountcategory = new mongoose.Schema({
    picture: {type: String, required: true},
    name: {type: String, required: true, unique: true}
})

const AccountCategoryModel = new mongoose.model("accountcategory", accountcategory)

const validate = (data) => {
    const Schema = Joi.object({
        picture: Joi.string().required().label("โปรดใส่รูปภาพ"),
        name: Joi.string().required().label("โปรดกรอกชื่อ"),
    })
    return Schema.validate(data);
}

module.exports = { AccountCategoryModel, validate }