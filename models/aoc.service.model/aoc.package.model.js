const mongoose = require('mongoose');
//const Joi = require('joi');
const OrderAocSchema = new mongoose.Schema({
    "orderid" : {type: Number, required : true},
    "mobilecredit" : {type: String, required: false, default: ""},
    "service" : {type: String, required: false, default: ""},
    "productid" : {type: String, required: false, default: ""},
    "productname" : {type: String, required: false, default: ""},
    "broker" : {type: String, required: false, default: ""},
    "broker_orderid" : {type: String, required: false, default: ""},
    "broker_txid" : {type: String, required: false, default: ""},
    "price" : {type: String, required: false, default: ""},
    "charge" : {type: String, required: false, default: ""},
    "charge2" :{type: String, required: false, default: ""},
    "mobile" :{type: String, required: false, default: ""},
    "ref1" :{type: String, required: false, default: ""},
    "ref2" : {type: String, required: false, default: ""},
    "cardcode" : {type: String, required: false, default: ""},
    "cardserial" : {type: String, required: false, default: ""},
    "date" : {type: String, required: false, default: ""},
    "time" : {type: String, required: false, default: ""},
    "point" : {type: String, required: false, default: ""},
    "total" : {type: Number, required : false, default : 0},
    "card" : {type: String, required: false, default: ""},
    "txid" : {type: String, required: false, default: ""},
    "slip_path" : {type: String, required: false, default: ""},
    "show_broker_logo" : {type: String, required: false, default: ""},
    "status" : {type: String, required: false, default: "wait"}
})

const OrderAoc = mongoose.model('order_aoc', OrderAocSchema);

module.exports = {OrderAoc}