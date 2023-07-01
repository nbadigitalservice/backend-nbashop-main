const mongoose = require("mongoose");
const Joi = require("joi");

const ApiPartnerSchema = new mongoose.Schema({
    partner_name:{type:String, required:true,unique:true},
    token:{type:String, required:true}
},{timestamps:true})

const ApiPartner = mongoose.model("ApiPartner", ApiPartnerSchema);

module.exports = {ApiPartner};