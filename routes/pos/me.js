const router = require("express").Router();
const { Admins } = require("../../models/pos.models/admin.model");
const { Partners } = require("../../models/pos.models/partner.model");
const { Employee } = require("../../models/pos.models/employee.model");
const { Shop } = require("../../models/pos.models/shop.model");
const { Dealers } = require("../../models/pos.models/dealer.model");
const { Company } = require("../../models/pos.models/company.model");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();
const auth = require("../../lib/auth");
// partner_username
// emp_password

router.post("/", auth, async (req, res) => {
  const { decoded } = req;
  try {
    console.log("call me", decoded);

    if (decoded && decoded.row === "admin") {
      const id = decoded._id;
      Admins.findOne({ _id: id })
        .then((item) => {
          console.log(item);
          return res.status(200).send({
            name: item.admin_name,
            username: item.admin_username,
            level: "admin",
            position: item.admin_position,
          });
        })
        .catch(() =>
          res.status(400).send({ message: "มีบางอย่างผิดพลาด", status: false })
        );
    } else if (decoded && decoded.row === "partner") {
      const id = decoded._id;
      console.log(id);
      Partners.findOne({ _id: id })
        .then((item) => {
          console.log(item);
          return res.status(200).send({
            _id: item._id,
            name: item.partner_name,
            username: item.partner_email,
            level: "partner",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({ message: "มีบางอย่างผิดพลาด", status: false });
        });
    } else if (decoded && decoded.row === "dealer") {
      const id = decoded._id;
      console.log(id);
      Dealers.findOne({ _id: id })
        .then((item) => {
          console.log(item);
          return res.status(200).send({
            _id: item._id,
            name: item.dealer_name,
            username: item.dealer_username,
            level: "dealer",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({ message: "มีบางอย่างผิดพลาด", status: false });
        });
    } else if (decoded && decoded.row === "company") {
      const id = decoded._id;
      Company.findOne({ _id: id })
        .then((item) => {
          console.log(item);
          return res.status(200).send({
            _id: item._id,
            name: item.company_name,
            username: item.company_username,
            level: "company",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({ message: "มีบางอย่างผิดพลาด", status: false });
        });
    } else {
      const id = decoded._id;
      Employee.findOne({ _id: id })
        .then((item) => {
          console.log(item);
          return res.status(200).send({
            name: item.employee_name,
            username: item.employee_username,
            level: "employee",
            position: item.employee_position,
          });
        })
        .catch(() =>
          res.status(400).send({ message: "มีบางอย่างผิดพลาด", status: false })
        );
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", status: false });
  }
});

module.exports = router;
