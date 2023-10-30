const mongoose = require('mongoose');
//const Joi = require('joi');
const AirportinfoSchema = new mongoose.Schema({
    "Code" : {type: Number, required : true},
    "Language" : {type: String, required: true},
    "Name" : {type: String, required: true},
    "CountryCode" : {type: String, required: true},
})

const airportinfo = mongoose.model('api_airportinfo', AirportinfoSchema);

module.exports = {airportinfo}