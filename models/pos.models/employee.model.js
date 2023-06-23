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

const EmployeeSchema = new mongoose.Schema({
  employee_shop_id: { type: String, required: true },
  employee_name: { type: String, required: true }, //ชื่อ
  employee_username: { type: String, required: true }, //id
  employee_password: { type: String, required: true }, //รหัส
  employee_phone: { type: String, required: true },
  employee_position: { type: String, required: false, default: "general" },
  employee_status: { type: Boolean, required: false, default: true },
  employee_date_start: { type: Date, required: false, default: Date.now() }, // เริ่ม
});

EmployeeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, row: "employee" },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "4h",
    }
  );
  return token;
};

const Employee = mongoose.model("employee", EmployeeSchema);

const validate = (data) => {
  const schema = Joi.object({
    employee_shop_id: Joi.string().required().label("กรุณากรอกไอดี Shop ด้วย"),
    employee_name: Joi.string().required().label("กรุณากรอกชื่อผู้ใช้ด้วย"),
    employee_username: Joi.string().required().label("กรุณากรอกไอดีผู้ใช้ด้วย"),
    employee_password: passwordComplexity(complexityOptions)
      .required()
      .label("ไม่มีข้อมูลรหัสผ่าน"),
    employee_phone: Joi.string().required().label("ไม่มีข้อมูลเบอร์โทรศัพท์"),
    employee_position: Joi.string().default("ไม่มีข้อมูลที่อยู่"),
    employee_status: Joi.boolean().default(true),
    employee_date_start: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { Employee, validate };
