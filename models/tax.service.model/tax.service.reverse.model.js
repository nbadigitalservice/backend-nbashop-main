const mongoose = require('mongoose');
const Joi = require('joi');

const taxreverse = new mongoose.Schema({
    orderid: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    reverse_price: { type: Number, required: true },
    servicecharge: { type: Number, required: true },
    tax_value: { type: Number },
    tax_mulct_value: { type: Number },
    traffic_mulct_value: { type: Number },
    other: { type: Number },
    status: { type: String, enum: ['รอการยืนยันจากลูกค้า', 'ลูกค้ายืนยันแล้ว'] }
})

const TaxReverseModel = new mongoose.model("taxreverse", taxreverse)

module.exports = { TaxReverseModel }