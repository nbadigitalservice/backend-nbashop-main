const mongoose = require("mongoose");
const Joi = require("joi");

const catedetailSchema = new mongoose.Schema(
    {
        detail_id : {type: String},
        detail_name_th :{type:String},
        detail_name_en :{type:String},
        detail_cost :{type:String},
        unit:{type:String},
        type_id:{type:String},
        vendor_id:{type:String}

    },
    {timestamp: true}
);

const category_detail = mongoose.model('Categories_detail', catedetailSchema);
module.exports =  category_detail ;
