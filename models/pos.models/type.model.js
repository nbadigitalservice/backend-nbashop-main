const mongoose = require("mongoose");
const Joi = require("joi");

const TypeSchema = new mongoose.Schema({
  type_name: { type: String, required: true }, // Partner
});

const Type = mongoose.model("type", TypeSchema);

const validate = (data) => {
  const schema = Joi.object({
    type_name: Joi.string().required().label("กรุณากรอกชื่อประเภทสินค้าด้วย"),
  });
  return schema.validate(data);
};

module.exports = { Type, validate };
