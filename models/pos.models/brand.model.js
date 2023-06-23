const mongoose = require("mongoose");
const Joi = require("joi");

const BrandSchema = new mongoose.Schema({
  brand_dealer_id: { type: String, required: true },
  brand_logo: { type: String, required: false, default: "" },
  brand_name: { type: String, required: true },
  brand_detail: { type: String, required: false, default: "" },
  brand_status: { type: Boolean, required: false, default: false },
  brand_status_required: {
    type: String,
    required: false,
    default: "รอตรวจสอบ",
  },
  brand_timestamp: { type: Array, required: false, default: [] }, // เริ่ม
});

const Brand = mongoose.model("brand", BrandSchema);

const validate = (data) => {
  const schema = Joi.object({
    brand_dealer_id: Joi.string().required(),
    brand_logo: Joi.string().default(""),
    brand_name: Joi.string().required(),
    brand_detail: Joi.string().required(),
    brand_status: Joi.boolean().default(false),
    brand_status_requiredL: Joi.String().default("รอตรวจสอบ"),
    brand_timestamp: Joi.array().raw().default([]),
  });
  return schema.validate(data);
};

module.exports = { Brand, validate };
