const mongoose = require("mongoose");
const Joi = require("joi");

const orderdeliver = new mongoose.Schema({
    orderid: { type: String, required: true },
    detail: { type: String, required: true },
    picture: {
        type: [{
            imgUrl: { type: String, required: true },
        }]
    },
    transport: { type: String },
    trackingNo: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

const OrderDeliverModel = new mongoose.model("orderdeliver", orderdeliver)

module.exports = { OrderDeliverModel }