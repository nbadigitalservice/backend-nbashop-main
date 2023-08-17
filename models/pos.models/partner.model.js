const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const dayjs = require("dayjs");

const complexityOptions = {
  min: 6,
  max: 30,
  lowerCase: 0,
  upperCase: 0,
  numeric: 0,
  symbol: 0,
  requirementCount: 2,
};

const PartnersSchema = new mongoose.Schema({
  partner_name: { type: String, required: true }, //ชื่อ
  partner_iden: { type: String, required: true }, // เลขบัตร
  partner_email: { type: String, required: true }, //เมล
  partner_password: { type: String, required: true }, //รหัส
  partner_wallet: { type: Number, required: false, default: 0 },
  partner_money: { type: Number, required: false, default: 0 },
  partner_phone: { type: String, required: true, unique: true },
  partner_level_note: { type: String, required: false, default: "ไม่มี" },
  partner_district: { type: String, required: true },
  partner_state: { type: String, required: true },
  partner_province: { type: String, required: true },
  partner_address: { type: String, required: true },
  partner_status: { type: Boolean, required: false, default: true },
  partner_date_start: { type: Date, required: false, default: Date.now() }, // เริ่ม
  partner_date_end: { type: Date, required: false, default: Date.now() }, // หมดสัญญา
  partner_promise :{
    status: {type: Boolean, required: false, default : false},
    timestamp : {type: Date, required: false, default : dayjs(Date.now()).format()}
  },
  partner_type: { type: String, enum: ['One Stop Shop', 'One Stop Service'], require: true }
});

PartnersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, row: "partner" },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "4h",
    }
  );
  return token;
};

const Partners = mongoose.model("partners", PartnersSchema);

const validate = (data) => {
  const schema = Joi.object({
    partner_name: Joi.string().required().label("กรุณากรอกชื่อผู้ใช้ด้วย"),
    partner_iden: Joi.string()
      .required()
      .label("กรุณากรอกรหัสบัตร ปชช ผู้ใช้ด้วย"),
    partner_email: Joi.string().required().label("กรุณากรอกอีเมลผู้ใช้ด้วย"),
    partner_password: passwordComplexity(complexityOptions)
      .required()
      .label("ไม่มีข้อมูลรหัสผ่าน"),
    partner_wallet: Joi.number().default(0),
    partner_money: Joi.number().default(0),
    partner_phone: Joi.string().required().label("ไม่มีข้อมูลเบอร์โทรศัพท์"),
    partner_level_note: Joi.string().default("ไม่มี"),
    partner_district: Joi.string().required(),
    partner_state: Joi.string().required(),
    partner_province: Joi.string().required(),

    partner_address: Joi.string().required().label("ไม่มีข้อมูลที่อยู่"),
    partner_status: Joi.boolean().default(true),
    partner_date_start: Joi.date().raw().default(Date.now()),
    partner_date_end: Joi.date().raw().default(Date.now()),
    partner_promise : Joi.object({
      status: Joi.boolean().default(false),
      timestamp: Joi.date().default(dayjs(Date.now()).format())
    }),
    partner_type: Joi.string().required().label("กรุณาระบุประเภทของพาร์ทเนอร์")
  });
  return schema.validate(data);
};

module.exports = { Partners, validate };
