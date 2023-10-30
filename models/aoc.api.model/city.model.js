const mongoose = require('mongoose');
//const Joi = require('joi');
const CitySchema = new mongoose.Schema({
    "Code" : {type: Number, required : true},
    "Language" : {type: String, required: true},
    "Name" : {type: String, required: true},
    "CountryCode" : {type: String, required: true},
})

const city = mongoose.model('api_city', CitySchema);

module.exports = {city}