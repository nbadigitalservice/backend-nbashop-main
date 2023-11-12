const mongoose = require("mongoose");
const Joi = require("joi");

const category_typeSchema = new mongoose.Schema(
    {
        type_id : {type: String},
        detail_th :{type:String},
        detail_en :{type:String},
        category_id :{type:String},

    },
    {timestamp: true}
);

const category_Type = mongoose.model('Categories_type', category_typeSchema);
module.exports =  category_Type ;
