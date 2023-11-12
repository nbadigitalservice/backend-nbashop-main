const mongoose = require("mongoose");
const Joi = require("joi");

const antiquesSchema = new mongoose.Schema(
    {
        category_id : {type: String},
        category_name :{type:String},
        category_type :{type:String},
        detail_id :{type:String},
        vandor_id:{type:String},
        unit:{type:String}

    },
    {timestamp: true}
);

const category = mongoose.model('Category', antiquesSchema);
module.exports =  category ;
