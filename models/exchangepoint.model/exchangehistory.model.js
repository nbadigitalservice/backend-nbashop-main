const mongoose = require('mongoose');

const exchangehistory = new mongoose.Schema({
    tel: {type: String, required: true},
    item_id: {type: String, required: true},
    name: {type: String, required: true},
    exchangerate: {type: Number, required:true},
})

const ExchangeHistory = new mongoose.model("exchangehistory", exchangehistory)

module.exports = { ExchangeHistory }