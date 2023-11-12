const mongoose = require("mongoose");
const Joi = require("joi");

const adminantiquesSchema = new mongoose.Schema(
    {
        admin_name : {type: String},
        admin_username :{type:String},
        admin_password :{type:String},
        admin_position :{type:String},
        admin_date_start:{type:Date}

    },
    {timestamp: true}
);

const admin_category = mongoose.model('Admin', adminantiquesSchema);
module.exports =  admin_category ;
