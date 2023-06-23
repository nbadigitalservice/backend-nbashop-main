const mongoose = require("mongoose");
const Joi = require("joi");

const PreOrderShopFullSchema = new mongoose.Schema({
  poshopf_ref_short: { type: String, required: true },
  poshopf_ref_full: { type: String, required: false, default: "ไม่มี" },
  poshopf_shop_id: { type: String, required: true },
  poshopf_detail: { type: Array, required: false, default: [] },
  poshopf_total: { type: Number, required: true },
  poshopf_type_price: { type: String, required: false, default: "เงินสด" },
  // poshopf_total_price: { type: Number, required: true },
  poshopf_discount: { type: Number, required: false, default: 0 },
  poshopf_status: { type: Boolean, required: false, default: true },

  poshopf_customer_name: { type: String, required: false, default: "ไม่มี" },
  poshopf_customer_phone: { type: String, required: false, default: "ไม่มี" },
  poshopf_customer_number: { type: String, required: false, default: "ไม่มี" },
  poshopf_customer_address: { type: String, required: false, default: "ไม่มี" },

  poshopf_ref_short_id: { type: String, required: false, default: "ไม่มี" }, // กรณียกเลิกบิล
  poshopf_timestamp: { type: Date, required: false, default: Date.now() },
  poshopf_employee: { type: String, required: false, default: "ไม่มี" }, // คนที่ทำรายการ
});

const PreOrderShopFull = mongoose.model(
  "preorder_shop_full",
  PreOrderShopFullSchema
);

const validate = (data) => {
  const schema = Joi.object({
    poshopf_ref_short: Joi.string().required().label("กรุณากรอกไอดีรายการด้วย"),
    poshopf_ref_full: Joi.string().default("ไม่มี"),
    poshopf_shop_id: Joi.string()
      .required()
      .label("กรุณากรอกไอดีร้านที่ทำรายการด้วย"),
    poshopf_detail: Joi.array().default([]),
    poshopf_total: Joi.number().required(),
    poshopf_type_price: Joi.string().default("เงินสด"),
    // poshopf_total_price: Joi.number().default(0),
    poshopf_discount: Joi.number().default(0),
    poshopf_status: Joi.boolean().default(true),

    poshopf_customer_name: Joi.string().default("ไม่มี"),
    poshopf_customer_phone: Joi.string().default("ไม่มี"),
    poshopf_customer_number: Joi.string().default("ไม่มี"),
    poshopf_customer_address: Joi.string().default("ไม่มี"),

    poshopf_ref_short_id: Joi.string().default("ไม่มี"),
    poshopf_timestamp: Joi.date().raw().default(Date.now()),
    poshopf_employee: Joi.string().default("ไม่มี"),
  });
  return schema.validate(data);
};

module.exports = { PreOrderShopFull, validate };
