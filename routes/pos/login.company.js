const router = require("express").Router();
const { Company } = require("../../models/pos.models/company.model");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();
// partner_username
// emp_password

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    let company = await Company.findOne({
      company_username: req.body.username,
    });
    console.log(company)
    if (!company) {
      return res.status(401).send({
        message: "username is not find",
        status: false,
      });
    }
    const validPasswordAdmin = await bcrypt.compare(
      req.body.password,
      company.company_password
    );
    if (!validPasswordAdmin)
      // รหัสไม่ตรง
      return res.status(401).send({
        message: "รหัสผ่านผิด",
        status: false,
      });

    const token = company.generateAuthToken();

    const ResponesData = {
      company_username: company.company_username,
      company_phone: company.company_phone,
      company_address: company.company_address,
    };
    console.log(ResponesData);
    res.status(200).send({
      token: token,
      message: "เข้าสู่ระบบสำเร็จ",
      company: ResponesData,
      status: true,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("username"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};

module.exports = router;
