const mongoose = require("mongoose");
const Joi = require("joi");

const ProductGraphicPriceSchema = new mongoose.Schema({

    product_graphic_id:{type:String,required:true},
    price:{type:Number,required:true},
    cost_NBA:{type:Number,required:true},
    profit_NBA:{type:Number,required:true},
    quantity_per_pack:{type:Number,required:true},
    freight:{type:Number,required:true},
    minimun:{type:Number,required:true}

});

const ProductGraphicPrice = mongoose.model('ProductGraphicPrice',ProductGraphicPriceSchema);

module.exports = { ProductGraphicPrice }