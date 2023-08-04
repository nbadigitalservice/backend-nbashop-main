const mongoose = require("mongoose");
const Joi = require("joi");

const orderservice = new mongoose.Schema({
    customer_name: {type: String},
    customer_tel: {type: String},
    customer_address: {type: String},
    partnername: {type: String, required: true},
    servicename: {type: String, required: true},
    shopid: {type: String, required: true},
    packageid: {type: String, required: true},
    quantity: {type:  String, required: true},
    price: {type: Number, required: true},
    totalprice: {type: Number, required: true},
    status: {type: String, enum: ['รอดำเนินการ', 'กำลังดำเนินการ', 'เสร็จสิ้นการดำเนินการ'], default: 'รอดำเนินการ'},
    timestamp: {type: Date, default: Date.now}
})

const OrderServiceModel = new mongoose.model("orderservice",orderservice)

const validate = (data) => {
    const Schema = Joi.object({
        shopid: Joi.string().required().allow("").label("โปรดกรอกidลูกค้า"),
        packageid: Joi.string().required().label("โปรดกรอกไอดีแพ็คเกจ"),
        quantity: Joi.string().required().label("โปรดกรอกจำนวนสินค้า")
    })
    return Schema.validate(data);
}

module.exports = { OrderServiceModel,validate }