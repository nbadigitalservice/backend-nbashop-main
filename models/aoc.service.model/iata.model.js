const mongoose = require('mongoose');
//const Joi = require('joi');
const IATASchema = new mongoose.Schema({
    "id" : {type: Number, required : true},
    "province_th" : {type: String, required: true},
    "province_en" : {type: String, required: true},
    "IATA" : {type: String, required: true},
    "name" : {type: String, required: true},
})

const IATA = mongoose.model('api_aocs', IATASchema);

module.exports = {IATA}