const mongoose = require("mongoose");
const Joi = require("joi");

const PreorderArtworkSchema = new mongoose.Schema({
  shop_id: {type: String, required: true},
  partner_tel : {type: String, required: true},    //เบอร์โทร แพลตฟอร์ม
  invoice : {type: String, required: false, default: ''},
  artwork_type : {type: String, required: true},
  cus_name : {type: String, required: true},
  cus_tel : {type: String, required: true},
  cus_address : {type: String, required: false, default:''}, //ที่อยู่จัดส่ง
  payment_type : {type: String, required: true},
  total : {type: Number, required: true},   //ยอดรวมสุทธิ
  receive : {type: Number, required: true}, //ยอดเงินที่รับมา
  discount: {type:  Number, required: true}, // ส่วนลด
  order_detail: {type: Array, required: true}, //รายการสั่งซื้อ
  /*
    name : ชื่อรายการสื่อสิ่งพิมพ์
    width : ความกว้าง
    height: ความสูง
    type : ประเภทของงานออกแบบ เช่น เป็นป้ายไวนิล "หน้าเดียว หรือ สองหน้า " เป็นต้น 
    detail :  รายละเอียดคร่าวๆ ถ้ามี
    price : ราคาต่อหน่วย
    amount : จำนวนที่สั่ง
    total :  ยอดรวม
  */
  status: {type:Array, required: true},
  /*
    name : ขื่้อสถานะ รอตรวจสอบ, ดำเนินการ, ยกเลิก
    detail : รายละเอียดหรือหมายเหตุ
    timestamp: วันเวลาทำการ
  */
  tracking_code : {type: String, required: false, default: ''},
  courier_name : {type: String, required: false, default: ''},
  timestamp: {type: Date, required: true},
  employee : {type: String, required: true},
  employee_nba : {type: String, required: false, default:''},
  remark : { type: String, required: false, default: ''},
  profit : {
    nba: {type : Number , required: false, default: 0},
    platform : {
      level_owner : {type :Number , required: false, default : 0},
      level_one : {type: Number , required : false, default : 0},
      level_two : {type: Number , required: false, default: 0 },
      level_tree : {type: Number , required: false, default : 0}
    },
    terrestrial:{
      district : {type:Number, required: false, default: 0},
      state : {type: Number, required: false, default: 0},
      province : {type: Number, required : false, default: 0},
      bonus : {type: Number, required: false, default: 0},
    },
    central : {
      central : {type:Number, required: false, default: 0},
      allsale : {type:Number,required: false, default: 0}
    }
  }
});

const PreorderArtwork = mongoose.model(
  "preorder_artwork",
  PreorderArtworkSchema
);

const validate = (data) => {
  const schema = Joi.object({
    shop_id : Joi.string().required().label('ไม่พบไอดีร้านค้า'),
    partner_tel : Joi.string().required().label('ไม่พบเบอร์แพลตฟอร์มหรือพาร์ทเนอร์เพื่อรับค่าคอมมิชชั่น'),
    invoice : Joi.string().default(''),
    artwork_type : Joi.string().required().label('ไม่พบประเภทสื่อสิ่งพิมพ์'),
    cus_name : Joi.string().required().label('ไม่พบชื่อลูกค้า'),
    cus_tel : Joi.string().required().label('ไม่พบเบอร์โทรติดต่อลูกค้า'),
    cus_address : Joi.string().default(''),
    payment_type : Joi.string().required().label('ไม่พบประเภทการชำระเงิน'),
    total : Joi.number().required().label('ไม่พบยอดรวมสุทธิ'),
    receive : Joi.number().required().label('ไม่พบยอดรับเงิน'),
    discount : Joi.number().required().label('ไม่พบยอดส่วนลด'),
    order_detail : Joi.array().required().label('ไม่พบรายการสินค้า'),
    status: Joi.array().required().label('ไม่พบวันที่สั่งซื้อ'),
    courier_name : Joi.string().default(''),
    tracking_code : Joi.string().default(''),
    timestamp : Joi.date().required().label('ไม่พบวันเวลาที่สั่งซื้อ'),
    employee : Joi.string().required().label('ไม่พบพนักงานที่ทำรายการ'),
    employee_nba : Joi.string().default(''),
    remark : Joi.string().default('')
  });
  return schema.validate(data);
};

module.exports = {PreorderArtwork, validate};
