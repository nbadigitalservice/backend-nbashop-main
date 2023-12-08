const mongoose = require("mongoose");
const Joi = require("joi");

const taxreverse = new mongoose.Schema(
  {
    orderid: {type: String, required: true},
    shopid: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    reverse_price: {type: Number, required: true},
    servicecharge: {type: Number, required: true},
    status: {type: Array, required: true},
    detail: {type: String, required: true},
  },
  {timestamps: true}
);

const TaxReverseModel = new mongoose.model("taxreverse", taxreverse);

module.exports = {TaxReverseModel};
