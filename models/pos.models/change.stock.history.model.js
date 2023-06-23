const mongoose = require('mongoose');
const Joi = require('joi');

const ChangeStockHistorySchema = new mongoose.Schema({
    shop_id : {type : String, required : true},
    from : {type : Object , required : true},
    to : {type: Object , required : true},
    employee : {type :String, required: true},
    status : {type : Array, required:false, default : []}
})

const ChangeStockHistory = mongoose.model('change_stock_history', ChangeStockHistorySchema);

const validate = (data)=>{
    const schema = Joi.object({
        shop_id : Joi.string().required().label("ไม่พบไอดีร้านค้า"),
        from : Joi.object({
            product_id : Joi.string().required().label("ไม่พบไอดีสินค้าต้นทาง"),
            barcode : Joi.string().required().label('ไม่พบบาร์โค้ดต้นทาง'),
            amount : Joi.number().required().label('ไม่พบจำนวนสินค้าต้นทาง')
        }),
        to : Joi.object({
            product_id : Joi.string().required().label("ไม่พบไอดีสินค้าปลายทาง"),
            barcode : Joi.string().required().label('ไม่พบบาร์โค้ดปลายทาง'),
            amount : Joi.number().required().label('ไม่พบจำนวนสินค้าปลายทาง')
        }),
        employee : Joi.string().required().label('ไม่พบชื่อพนักงานที่ทำรายการ'),
        status : Joi.array().default([])
    });
    return schema.validate(data);
}

module.exports = {ChangeStockHistory, validate} 