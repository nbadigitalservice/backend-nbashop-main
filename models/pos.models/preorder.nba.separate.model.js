const mongoose = require("mongoose");
const Joi = require("joi");

const PreOrderNBASeparateSchema = new mongoose.Schema({
  poseparate_shop_id: { type: String, required: true },
  poseparate_perorder_id: { type: String, required: true },
  poseparate_brand_id: { type: String, required: false, default: "ไม่มี" },
  poseparate_ref: { type: String, required: true },
  poseparate_detail: { type: Array, required: false, default: [] },
  poseparate_status: {
    type: String,
    required: false,
    default: "ผู้ส่งกำลังเตรียมพัสดุ",
  },
  poseparate_parcel_detail: {
    courier_name: { type: String, required: false, default: "ไม่มี" },
    tracking_code: { type: String, required: false, default: "ไม่มี" },
  },
  poseparate_timestamp: { type: Array, required: false, default: [] },
});

const PreOrderNBASeparate = mongoose.model(
  "preorder_nba_separate",
  PreOrderNBASeparateSchema
);

const validate = (data) => {
  const schema = Joi.object({
    poseparate_shop_id: Joi.string().required(),
    poseparate_perorder_id: Joi.string().required(),
    poseparate_brand_id: Joi.string().required(),
    poseparate_ref: Joi.string().required(),
    poseparate_detail: Joi.array().default([]),
    poseparate_status: Joi.string().required("ผู้ส่งกำลังเตรียมพัสดุ"),
    poseparate_parcel_detail: Joi.object({
      courier_name: Joi.string().default("ไม่มี"),
      tracking_code: Joi.string().default("ไม่มี"),
    }),
    poseparate_timestamp: Joi.array().default([]),
  });
  return schema.validate(data);
};

module.exports = { PreOrderNBASeparate, validate };
