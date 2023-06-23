const mongoose = require("mongoose");
const Joi = require("joi");
const dayjs = require('dayjs');
const PreoderDealerSchema = new mongoose.Schema({
    invoice : {type : String, required: false, default: ''} ,
    dealer_id : {type: String, required: true},
    detail : {type : Array, required: true},        //รายการสินค้า
    cutoff_status: {type: Boolean, required: false, default: false},
    timestamp : {type: Date, required: true},
    createdAt: {type: Date, required: false,default: new Date()}
})

const PreorderDealer = mongoose.model('preorder_dealer', PreoderDealerSchema);

const validate = (data)=>{
    const schema = Joi.object({
        invoice : Joi.string().default('') ,
        dealer_id : Joi.string().required().label('ไม่พบ dealer_id'),
        detail : Joi.array().required().label('ไม่พบรายการสินค้า'),
        cutoff_status: Joi.boolean().default(false),
        timestamp : Joi.date().required().label('ไม่พบวันที่ทำรายการ'),
        createdAt : Joi.date().default(new Date())
    })
    return schema.validate(data);
}

module.exports = {PreorderDealer , validate};
