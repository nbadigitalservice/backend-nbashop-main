const mongoose = require("mongoose")
const Joi = require("joi")

const ordercanceled = new mongoose.Schema({
    orderid: { type: String, required: true},
    receiptnumber: { type: String, required: true},
    cost: { type: Number, required: true},
    customer_name: { type: String, required: true },
    customer_tel: { type: String, required: true },
    refund_amount: { type: Number, required: true },
    reason: { type: String, required: true },
    admin_id: { type: String, required: true },
    admin_name: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

const OrderCanceled = new mongoose.model("ordercanceled", ordercanceled)

module.exports = { OrderCanceled }