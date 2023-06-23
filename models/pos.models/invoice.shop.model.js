const mongoose = require("mongoose");
const Joi = require("joi");

const InvoiceShopSchema = new mongoose.Schema({
  invoice_ref: { type: String, required: true },
  invoice_shop_id: { type: String, required: true },
  invoice_detail: { type: Array, required: false, default: [] },
  invoice_status: { type: String, required: false, default: "ค้างชำระ" },
  invoice_image: { type: String, required: false, default: "" },
  invoice_timestamp: { type: Date, required: false, default: Date.now() },
  invoice_emp: { type: String, required: false, default: "ไม่มี" },
  invoice_poshop : {type: Array, required : false, default : []}
  // --------------------------------
});

const InvoiceShop = mongoose.model("invoice_shop", InvoiceShopSchema);

const validate = (data) => {
  const schema = Joi.object({
    invoice_ref: Joi.string().required(),
    invoice_shop_id: Joi.string().required(),
    invoice_detail: Joi.array().default([]),
    invoice_status: Joi.string().default("ค้างชำระ"),
    invoice_image: Joi.string().default(""),
    invoice_timestamp: Joi.date().label("ไม่มีวันที่ทำรายการเข้ามา"),
    invoice_emp: Joi.string().default("ไม่มี"),
    invoice_poshop : Joi.array().default([])
  });
  return schema.validate(data);
};

module.exports = { InvoiceShop, validate };
