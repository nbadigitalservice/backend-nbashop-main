const mongoose = require("mongoose");
const Joi = require("joi");

const ProductExpressSchema = new mongoose.Schema({
   shop_id : {type : String, require : true},
   name : {type : String , require: true},
   cost : {type : Number , require : true},
   price : {type : Number , require : true} 
});

const ProductExpress = mongoose.model('product_express', ProductExpressSchema);

const validate = (data)=>{
    const schema = Joi.object({
        shop_id : Joi.string().required().label("กรุณากรอกไอดีร้านค้า"),
        name : Joi.string().required().label("กรุณากรอกชื่อสินค้า"),
        cost : Joi.number().required().label("กรุณากรอกต้นทุนสินค้า"),
        price : Joi.number().required().label("กรุณากรอกราคาสินค้า")
    });
    return schema.validate(data);
}

module.exports = {ProductExpress , validate};

