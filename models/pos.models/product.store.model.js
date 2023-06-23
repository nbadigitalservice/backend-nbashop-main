const mongoose = require("mongoose");
const Joi = require("joi");

const ProductStoreSchema = new mongoose.Schema({
    productNBA_id : {type: String, required : true},
    productCompany_id : {type: String, required : true},
    productStore_amount : {type: Number, default: 0},
    status : {type: Array, required : true}
});

const ProductStore = mongoose.model("product_store" ,ProductStoreSchema);
const validate = (data)=>{
    const schema = Joi.object({
        productNBA_id : Joi.string().required().label("กรุณากรอกไอดีสินค้าที่อ้างอิง"),
        productCompany_id : Joi.string().required().label("กรุณากรอกข้อมูลไอดีบริษัท"),
        productStore_amount : Joi.number().default(0),
        status : Joi.array()
    });
    return schema.validate(data);
}

module.exports = {ProductStore , validate};
