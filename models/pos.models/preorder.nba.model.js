const mongoose = require("mongoose");
const Joi = require("joi");

const PreOrderNBASchema = new mongoose.Schema({
  ponba_shop_id: { type: String, required: true }, // Partner
  ponba_number: { type: String, required: true }, //
  ponba_detail: { type: Array, required: false, default: [] },
  ponba_total: { type: Number, required: true },
  ponba_status: { type: String, required: false, default: "รอตรวจสอบ" },
  ponba_timestamp: { type: Array, required: false, default: [] },
});

const PreOrderNBA = mongoose.model("preorder_nba", PreOrderNBASchema);

const validate = (data) => {
  const schema = Joi.object({
    ponba_shop_id: Joi.string()
      .required()
      .label("กรุณากรอกไอดีผู้ทำรายการด้วย"),
    ponba_number: Joi.string().required().label("กรุณากรอกเลขที่ใบ PO ด้วย"),
    ponba_detail: Joi.array().default([]),
    ponba_total: Joi.number().required().label("กรุณากรอกยอดคำสั่งซื้อด้วย"),
    ponba_status: Joi.string().default("รอตรวจสอบ"),
    ponba_timestamp: Joi.array().default([]),
  });
  return schema.validate(data);
};

module.exports = { PreOrderNBA, validate };
