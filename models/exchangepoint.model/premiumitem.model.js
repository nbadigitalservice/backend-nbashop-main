const mongoose = require('mongoose');

const premiumitem = new mongoose.Schema({
    picture: {type: String, required: true},
    name: {type: String, required: true, unique: true},
    detail: {type:  String},
    exchangerate: {type: Number, required:true},
    stock: {type: Number, required:true}
})

const PremiumItem = new mongoose.model("premiumitem", premiumitem)

module.exports = { PremiumItem }