const mongoose = require('mongoose');
//const Joi = require('joi');
const AirportSchema = new mongoose.Schema({
    "Code" : {type: Number, required : true},
    "Language" : {type: String, required: true},
    "Name" : {type: String, required: true},
    "CountryCode" : {type: String, required: true},
})

const airport_code = mongoose.model('api_airportcode', AirportSchema);

module.exports = {airport_code}