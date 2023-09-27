const mongoose = require('mongoose');
const Joi = require('joi');
const OrderCsSchema = new mongoose.Schema({
    shop_id : {type : String, required: true}, //shop ที่ทำรายการ
    invoice : {type : String, required: false, default:"ไม่มี"}, //สร้างมา
    mobile : {type : String, required : false, default: "ไม่มี"}, //เบอร์โทรสำหรับสะสมแต้ม
    detail : {type: Object, required : false}, //ค่าตอบกับจาก partner API
    company : {type: String, required: false, default:""}, //บริษัทที่ทำการเชื่อมต่อ API 
    payment_type : {type: String, required:true},
    price : {type: Number, required : true}, //ชำระในบิล
    charge : {type: Number, required: true}, //ค่าธรรมเนียมหน้าร้านค้ารวม
    receive :{type: Number, required : true}, //จำนวนเงินที่รับ
    cost_nba : {type: Number, required : true}, //ค่าธรรมเนียมที่เอ็นบีเอได้รับ
    cost_shop : {type: Number, required : true}, //ค่าธรรมเนียมสุทธิที่ได้รับหน้างาน
    employee : {type: String, required : true}, //ชื่อพนักงานที่ทำรายการ
    status: {type: Array, required : true},
    transid : {type : String, required: false, default :''},
    image : {type: String, required: false, default: ''},
    timestamp: {type: Date, required: true},
    updated_by:{type:String},
    created_by:{type:String}
},{timestamps:true})

const OrderCs = mongoose.model('order_cs', OrderCsSchema);

const validate = (data)=>{
    const schema = Joi.object({
        shop_id : Joi.string().required().label('ไม่พบ shop id'),
        invoice : Joi.string().default("ไม่มี"),
        mobile : Joi.string().default("ไม่มี"),
        detail : Joi.object(),
        company : Joi.string().default("ไม่มี"),
        payment_type : Joi.string().required().label("ไม่พบ ประเภทการจ่าย"),
        price : Joi.number().required().label("ไม่พบ price ยอดชำระ"),
        charge : Joi.number().required().label("ไม่พบ charge ค่าธรรมเนียมรวม"),
        receive : Joi.number().required().label("ไม่พบ receive เงินที่รับ"),
        cost_nba : Joi.number().required().label("ไม่พบ nba"),
        cost_shop : Joi.number().required().label("ไม่พบกำไรของ shop"),
        employee : Joi.string().required().label("ไม่พบพนักงานทำรายการ"),
        status: Joi.array().required().label("ไม่ status"),
        transid : Joi.string().default(""),
        image : Joi.string().default(''),
        timestamp : Joi.date().required().label("ไม่พบวันเวลาทำรายการ"),
        updated_by: Joi.string().required().allow(""),
        created_by: Joi.string().required().allow(""),
    });
    return schema.validate(data);
}


module.exports = {OrderCs , validate};