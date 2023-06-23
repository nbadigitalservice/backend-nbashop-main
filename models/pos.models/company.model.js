const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
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

const CompanySchema = new mongoose.Schema({
  company_name: { type: String, required: true }, // Partner
  company_username: { type: String, required: true },
  company_password: { type: String, required: true },
  company_phone: { type: String, required: true }, //
  company_address: { type: String, required: true }, //
  company_date_start: { type: Date, required: false, default: Date.now() }, // เริ่ม
});

CompanySchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, row: "company" },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "24h",
    }
  );
  return token;
};

const Company = mongoose.model("company", CompanySchema);

const validate = (data) => {
  const schema = Joi.object({
    company_name: Joi.string().required().label("กรุณากรอกชื่อบริษัทด้วย"),
    company_username: Joi.string().required(),
    company_password: passwordComplexity(complexityOptions)
      .required()
      .label("company_password"),
    company_phone: Joi.string().required().label("กรุณากรอกเบอร์บริษัทด้วย"),
    company_address: Joi.string()
      .required()
      .label("กรุณากรอกที่อยู่บริษัทด้วย"),
    company_date_start: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { Company, validate };
