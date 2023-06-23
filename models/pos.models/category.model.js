const mongoose = require("mongoose");
const Joi = require("joi");

const CategorySchema = new mongoose.Schema({
    name : {type : String, required: true}
})

const Category = mongoose.model('category', CategorySchema);

const validate = (data)=>{
    const schema = Joi.object({
        name : Joi.string().required().label('ไม่มีชื่อหมวดหมู่สินค้า')
    });
    return schema.validate(data);
}

module.exports = {Category, validate}