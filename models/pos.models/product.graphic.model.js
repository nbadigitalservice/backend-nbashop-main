const mongoose = require("mongoose");
const Joi = require("joi");

const ProductGraphicSchema = new mongoose.Schema({

    name:{type:String, required:true,unique:true},
    category:{type:String, required:true},
    detail:{type:String,required:true},
    description:{type:String},
    imgUrl:{type:[String]},
    prices:{type:[
        {
            size:{type:String},
            price:{type:Number, required:true},
            cost:{type:Number, required:true},
            quantity_per_pack:{type:Number, required:true},
            freight:{type:Number, required:true},
            dealer_profit:{type:Number, required:true},
            minimun:{type:Number,required:true},
        }
    ]},

});

const ProductGraphic = mongoose.model("ProductGraphic",ProductGraphicSchema);

module.exports = {ProductGraphic}