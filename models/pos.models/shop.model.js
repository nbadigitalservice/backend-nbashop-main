const mongoose = require("mongoose");
const Joi = require("joi");

const ShopSchema = new mongoose.Schema({
  shop_partner_id: { type: String, required: true }, // Partner
  shop_credit: { type: Number, required: true },
  shop_debit: { type: Number, required: false, default: 0 },
  shop_name: { type: String, required: true }, //ชื่อ
  shop_logo: { type: String, required: false, default: "" }, // Logo
  shop_address: { type: String, required: true }, //ที่อยู่
  shop_district: { type: String, required: true }, //ตำบล
  shop_state: { type: String, required: true }, //อำเภอ
  shop_province: { type: String, required: true }, //จังหวัด
  shop_postcode: { type: String, required: true }, //รหัสไปรษณีย์
  shop_branch_id : {type: String, required: false, default: "ไม่มี"}, // รหัสสาขา KERRY SHOP
  shop_latitude : {type:Number, required : false, default:0},
  shop_longtitude : {type:Number, required: false, default: 0},
  shop_number: { type: String, required: true },
  shop_status: { type: Boolean, required: false, default: true },
  shop_level_name: { type: String, required: false, default: "ระดับตำบล" },
  shop_level_note: { type: String, required: false, default: "ไม่มี" },
  shop_function: { type: Array, required: false, default: [] },
  shop_status_tax: { type: String, required: false, default: "ไม่มี" },
  shop_tax_name: { type: String, required: false, default: "ไม่มี" },
  shop_tax_number: { type: String, required: false, default: "ไม่มี" },
  shop_tax_address: { type: String, required: false, default: "ไม่มี" },
  shop_tax_phone: { type: String, required: false, default: "ไม่มี" },
  shop_date_start: { type: Date, required: false, default: Date.now() }, // เริ่ม
});

const Shop = mongoose.model("shop", ShopSchema);

const validate = (data) => {
  const schema = Joi.object({
    shop_partner_id: Joi.string().required().label("กรุณากรอกไอดีเจ้าของด้วย"),
    shop_credit: Joi.number().required().label("กรุณากรอกเครดิตเริ่มต้นด้วย"),
    shop_debit: Joi.number().default(0),
    shop_name: Joi.string().required().label("กรุณากรอกชื่อร้านด้วย"),
    shop_logo: Joi.string().default(""),
    shop_address: Joi.string().required().label("กรุณากรอกที่อยู่ร้านด้วย"),
    shop_district: Joi.string().required().label("กรุณากรอกตำบลด้วย"),
    shop_state: Joi.string().required().label("กรุณากรอกอำเภอด้วย"),
    shop_province: Joi.string().required().label("กรุณากรอกจังหวัดด้วย"),
    shop_postcode: Joi.string().required().label("กรุณากรอกรหัสไปรษณีย์ด้วย"),
    shop_branch_id: Joi.string().default("ไม่มี"),
    shop_latitude : Joi.number().default(0),
    shop_longtitude : Joi.number().default(0),
    shop_number: Joi.string().required().label("กรุณากรอกรหัสร้านด้วย"),
    shop_status: Joi.boolean().default(true),
    shop_level_name: Joi.string().default("ระดับตำบล"),
    shop_level_note: Joi.string().default("ไม่มี"),
    shop_function: Joi.array().default([]), // เปิดการใช้งานบริการ

    shop_status_tax: Joi.string().default("ไม่มี"), // ลงทะเบียนพาณิย์, เป็นผู้เสียภาษี
    shop_tax_name: Joi.string().default("ไม่มี"), // ชื่อผู้ประกอบการ, ชื่อผู้ลงทะเบียนผู้เสียภาษี
    shop_tax_number: Joi.string().default("ไม่มี"), // เลขผู้เสียภาษี
    shop_tax_address: Joi.string().default("ไม่มี"), //
    shop_tax_phone: Joi.string().default("ไม่มี"),

    shop_vat_name: Joi.string().default("ไม่มี"), // ชื่อผู้เสีย
    shop_date_start: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { Shop, validate };
