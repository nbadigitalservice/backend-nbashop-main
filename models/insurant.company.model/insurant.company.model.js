const mongoose = require("mongoose");
const Joi = require("joi");

const insurancecompany = new mongoose.Schema({
    picture: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

const InsuranceCompanyModel = new mongoose.model("insurancecompany", insurancecompany)


module.exports = { InsuranceCompanyModel }