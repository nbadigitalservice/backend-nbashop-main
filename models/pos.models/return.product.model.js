const mongoose = require("mongoose");
const Joi = require("joi");

const ReturnProductSchema = new mongoose.Schema({
  rtp_shop_id: { type: String, required: true },
  // รหัสสินค้า
  rtp_product_id: { type: String, required: true },
  rtp_ref: { type: String, required: true },
  rtp_product_name: { type: String, required: true }, //
  rtp_amount: { type: Number, required: true }, //
  rtp_note: { type: String, required: false, default: "ไม่มี" },
  rtp_status: { type: String, required: false, default: "ส่งคำร้องขอแล้ว" },
  rtp_image: { type: Array, required: false, default: [] },
  rtp_timestamp: { type: Date, required: false, default: Date.now() },
});

const ReturnProduct = mongoose.model("return_product", ReturnProductSchema);

const validate = (data) => {
  const schema = Joi.object({
    rtp_shop_id: Joi.string().required().label("กรุณากรอกเลข Shop ด้วย"),
    rtp_product_id: Joi.string().required(),
    rtp_ref: Joi.string().required().label("กรุณากรอกเลขอ้างอิงด้วย"),
    rtp_product_name: Joi.string().required().label("กรุณากรอกชื่อสินค้าด้วย"),
    rtp_amount: Joi.number().required(),
    rtp_note: Joi.string().default("ไม่มี"),
    rtp_status: Joi.string().default("ส่งคำร้องขอแล้ว"),
    rtp_image: Joi.array().default([]),
    rtp_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { ReturnProduct, validate };
