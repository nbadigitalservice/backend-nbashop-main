const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 6,
  max: 30,
  lowerCase: 0,
  upperCase: 0,
  numeric: 0,
  symbol: 0,
  requirementCount: 2,
};

const DealerSchema = new mongoose.Schema({
  dealer_name: { type: String, required: true },
  dealer_username: { type: String, required: true }, // เบอร์
  dealer_password: { type: String, required: true },
  dealer_address: { type: String, required: true },
  dealer_phone: { type: String, required: true },
  dealer_status: { type: Boolean, required: false, default: true },
  dealer_status_promiss: {
    type: String,
    required: false,
    default: "รอตรวจสอบ",
  }, //

  dealer_bookbank: { type: String, required: false, default: "" }, // images
  dealer_bookbank_name: { type: String, required: false, default: "" },
  dealer_bookbank_number: { type: String, required: true },
  dealer_iden: { type: String, required: false, default: "" }, // images
  dealer_iden_number: { type: String, required: true },
  dealer_company_name: { type: String, required: false, default: "ไม่มี" },
  dealer_company_number: { type: String, required: false, default: "ไม่มี" },
  dealer_company_address: { type: String, required: false, default: "ไม่มี" },
  dealer_timestamp: { type: Array, required: false, default: [] },
});

DealerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, row: "dealer" },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "12h",
    }
  );
  return token;
};

const Dealers = mongoose.model("dealer", DealerSchema);

const validate = (data) => {
  const schema = Joi.object({
    dealer_name: Joi.string().required(),
    dealer_username: Joi.string().required(),
    dealer_password: passwordComplexity(complexityOptions)
      .required()
      .label("dealer_password"),
    dealer_address: Joi.string().required(),
    dealer_phone: Joi.string().required(),
    dealer_status: Joi.string().default(true),
    dealer_status_promiss: Joi.string().default("รอตรวจสอบ"), // ไม่ยอมรับเงื่อนไข ยอมรับเงื่อนไข
    dealer_bookbank: Joi.string().default(""),
    dealer_bookbank_name: Joi.string().default(""),
    dealer_bookbank_number: Joi.string().required(),
    dealer_iden: Joi.string().default(""),
    dealer_iden_number: Joi.string().required(),
    dealer_company_name: Joi.string().default("ไม่มี"),
    dealer_company_number: Joi.string().default("ไม่มี"),
    dealer_company_address: Joi.string().default("ไม่มี"),

    dealer_timestamp: Joi.array().default([]), // {name: ไม่ยอมรับเงื่อนไข, timestamp: Date.now(), remake: ไม่มี, note: ไม่มี} //รอตรวจสอบ
  });
  return schema.validate(data);
};

module.exports = { Dealers, validate };
