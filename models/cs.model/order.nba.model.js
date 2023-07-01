const mongoose = require('mongoose');

const OrderNBASchema = new mongoose.Schema({
    "orderid" : {type:Number , required: true},
    "invoice" : {type:String, required: true},
    "service" : {type:String ,required: false, default: "shop"},
    "productid" :{type:String, required : true},
    "productname" : {type: String, required: true},
    "ref1" : {type: String, required: false, default: ""},
    "ref2" : {type: String, required: false, default : ""},
    "price" : {type: String, required: true},
    "detail" : {type: String, required: false, default: ""},
    "charge" : {type: String, required: false, default: ""},
    "charge2" :{type: String, required: false, default: ""},
    "date" : {type: String, required: false, default: ""},
    "time" : {type: String, required: false, default: ""},
    "image" : {type: String, required: false, default: ""}, //รูปภาพที่แนบมา
    "slip_path" : {type: String, required: false, default: ""}, //่หลักฐานการจ่าย
    "remark" : {type:String, required: false, default: ''},
    "status" : {type: String, required: false, default: "wait"},
    "updated_by":{type:String, required: true, default:"ยังไม่มีการอัพเดท"},
    "created_by":{type:{
        name:{type:String, required:true,default:"ไม่ได้บันทึกผู้ทำรายการ"},
        phone:{type:String, required:true,default:"ไม่ได้บันทึกผู้ทำรายการ"}
    }}
},{timestamps:true});

const OrderNBA = mongoose.model('order_nba', OrderNBASchema);

module.exports = {OrderNBA}