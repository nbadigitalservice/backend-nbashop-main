const mongoose = require('mongoose');
//const Joi = require('joi');
const AirlineSchema = new mongoose.Schema({
    "Code" : {type: Number, required : true},
    "Language" : {type: String, required: true},
    "Name" : {type: String, required: true},
})

const airline_code = mongoose.model('api_airlinecode', AirlineSchema);

module.exports = {airline_code}