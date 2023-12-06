const mongoose = require("mongoose")
const Joi = require("joi")

const wallethistory = new mongoose.Schema({
    shop_id: { type: String, required: false},
    partner_id: { type: String, required: true},
    orderid: { type: String },
    name: { type: String, required: true },
    type: { type: String, enum: ['เงินเข้า', 'เงินออก'], required: true },
    amount: { type: Number, required: true },
    before: { type: Number, required: true},
    after: { type: Number, required: true},
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

const WalletHistory = new mongoose.model("wallethistory", wallethistory)

module.exports = { WalletHistory }