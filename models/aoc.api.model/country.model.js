const mongoose = require('mongoose');
//const Joi = require('joi');
const CountrySchema = new mongoose.Schema({
    "Code" : {type: Number, required : true},
    "Language" : {type: String, required: true},
    "Name" : {type: String, required: true},
    "Alpha3" : {type: String, required: true},
})

const country = mongoose.model('api_country', CountrySchema);

module.exports = {country}