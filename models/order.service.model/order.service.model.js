const mongoose = require("mongoose");
const Joi = require("joi");

const orderservice = new mongoose.Schema({
    receiptnumber: { type: String, required: true },
    picture: [{
        type: String,
    }],
    customer_contact: { type: String, required: true },
    customer_name: { type: String },
    customer_tel: { type: String },
    customer_address: { type: String },
    customer_iden_id: { type: String },
    customer_line: { type: String },
    partnername: { type: String, required: true },
    servicename: { type: String, required: true },
    shopid: { type: String },
    shop_partner_type: { type: String },
    branch_name: { type: String },
    branch_id: { type: String },
    product_detail: {
        type: [{
            packageid: { type: String, required: true },
            packagename: { type: String, required: true },
            packagedetail: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            freight: { type: Number},
            servicecharge: { type: Number},
        }]
    },
    paymenttype: { type: String, enum: ['เงินสด', 'เงินโอน', 'บัตรเครดิต', 'อื่นๆ'], required: true },
    moneyreceive: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    totalprice: { type: Number, required: true },
    totalFreight: { type: Number },
    total: { type: Number },
    change: { type: Number, required: true },
    status:{ type: Array, required: true},
    responsible_id: { type: String },
    responsible_name: { type: String },
    timestamp: { type: Date, default: Date.now() }
})

const OrderServiceModel = new mongoose.model("orderservice", orderservice)

const validate = (data) => {
    const Schema = Joi.object({
        customer_name: Joi.string().required().allow("").label("โปรดกรอกชื่อลูกค้า"),
        customer_tel: Joi.string().required().allow("").label("โปรดกรอกเบอร์โทรลูกค้า"),
        customer_address: Joi.string().required().allow("").label("โปรดกรอกที่อยู่ลูกค้า"),
        customer_iden_id: Joi.string().required().allow("").label("โปรดกรอกรหัสบัตรประชาชนลูกค้า"),
        customer_line: Joi.string().required().allow("").label("โปรดกรอกไลน์ลูกค้า"),
        shopid: Joi.string().required().allow("").label("โปรดกรอกidลูกค้า"),
        shop_partner_type: Joi.string().required().allow("").label("โปรดกรอกประเภทของพาร์ทเนอร์"),
        branch_name: Joi.string().required().allow("").label("โปรดกรอกชื่อสาขา"),
        branch_id: Joi.string().required().allow("").label("โปรดกรอกidสาขา"),
        packageid: Joi.string().required().label("โปรดกรอกไอดีแพ็คเกจ"),
        quantity: Joi.number().required().label("โปรดกรอกจำนวนสินค้า")
    })
    return Schema.validate(data);
}

module.exports = { OrderServiceModel, validate }