const mongoose = require("mongoose");
const Joi = require("joi");

const ProductGraphicSchema = new mongoose.Schema({

    name:{type:String, required:true,unique:true},
    category:{type:String, required:true},
    detail:{type:String,required:true},
    description:{type:String},
    imgUrl:{type:[String]},
  

});

const ProductGraphic = mongoose.model("ProductGraphic",ProductGraphicSchema);

module.exports = {ProductGraphic}