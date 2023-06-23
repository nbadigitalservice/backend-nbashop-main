const mongoose = require("mongoose");
const Joi = require("joi");

const AdvertisingSchema = new mongoose.Schema({
  advertising_name: { type: String, required: true }, // Partner
  advertising_image: { type: Array, required: false, default: [] },
});

const Advertising = mongoose.model("advertising_image", AdvertisingSchema);

const validate = (data) => {
  const schema = Joi.object({
    advertising_name: Joi.string().required(),
    advertising_image: Joi.string().default([]),
  });
  return schema.validate(data);
};

module.exports = { Advertising, validate };
