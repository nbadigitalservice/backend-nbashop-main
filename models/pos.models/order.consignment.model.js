const mongoose = require('mongoose');
const Joi = require('joi');

const OrderConsignmentSchema = new mongoose.Schema({
    pocon_id : {type: String, required : true},
    barcode : {type: String, required: true},
    shop_id : {type: String, required: true},
    dealer_id : {type: String, required : false, default: ''},
    tracking_code : {type: String, required: false, default: ''},   //บริษัท ขนส่ง
    tracking_number : {type: String, required: false, default: ''}, //เลขติดตามพัสดุ
    product_detail : {type: Array , required: true},
    status : {type: Array, required: true}
});
const OrderConsignment = mongoose.model('order_consignment', OrderConsignmentSchema);


const validate = (data)=>{
    const schema = Joi.object({
        pocon_id : Joi.string().required().label('ไม่พบไอดี Preorder Consignment อ้างอิง'),
        barcode : Joi.string().required().label('ไม่พบ Barcode'),
        shop_id : Joi.string().required().label('ไม่พบไอดี shop'),
        dealer_id : Joi.string().required().label('ไม่พบ dealer id'),
        tracking_code : Joi.string().default(''),
        tracking_number : Joi.string().default(''),
        product_detail : Joi.array().required().label('ไม่พบรายการสินค้า'),
        status: Joi.array().required().label('ไม่พบสถานะการทำรายการ')
    })
    return schema.validate(data);
}

module.exports = {OrderConsignment, validate}