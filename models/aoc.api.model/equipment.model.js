const mongoose = require('mongoose');
//const Joi = require('joi');
const EquipmentSchema = new mongoose.Schema({
    "Code" : {type: Number, required : true},
    "Name" : {type: String, required: true},
})

const equipment = mongoose.model('api_equipment', EquipmentSchema);

module.exports = {equipment}