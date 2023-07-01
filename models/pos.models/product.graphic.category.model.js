const mongoose = require("mongoose");

const ProductGraphicCategorySchema = new mongoose.Schema({

    name:{type:String, required:true,unique:true},
    img_url:{type:String}


},{timestamps:true});

const ProductGraphicCategory = mongoose.model("ProductGraphicCategory",ProductGraphicCategorySchema);

module.exports = {ProductGraphicCategory}