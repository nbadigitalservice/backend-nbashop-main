const mongoose = require("mongoose");
const Joi = require("joi");

const actCarSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  price_service: {type: Number, required: true}
});

const TypeCars = new mongoose.model("act_typecar", actCarSchema);

const validate = (data) => {
  const Schema = Joi.object({
    name: Joi.string().required().label("โปรดกรอกชื่อ"),
    price_service: Joi.number().required().label("โปรดกรอกค่าบริการ")
  });
  return Schema.validate(data);
};

module.exports = {TypeCars, validate};
