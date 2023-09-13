const mongoose = require("mongoose");
const Joi = require("joi");

const PercentSchema = new mongoose.Schema({
  percent: {
    central: { type: Number, required: true },
    platform: { type: Number, required: true },
    terrestrial: { type: Number, required: true },
  },
  percent_central: {
    central: { type: Number, required: true },
    allsale: { type: Number, required: true },
  },
  percent_platform: {
    level_one: { type: Number, required: true },
    level_two: { type: Number, required: true },
    level_tree: { type: Number, required: true },
    level_owner: { type: Number, required: true },
  },
  percent_terrestrial: {
    district: { type: Number, required: true },
    state: { type: Number, required: true },
    province: { type: Number, required: true },
    bonus: { type: Number, required: true },
  },
  percent_timestamp: { type: Array, required: false, default: [] },
});

const Percent = mongoose.model("percent_profit", PercentSchema);

const validate = (data) => {
  const schema = Joi.object({
    percent: Joi.object({
      central: Joi.number().required(),
      platform: Joi.number().required(),
      terrestrial: Joi.number().required(),
    }),

    percent_central: Joi.object({
      central: Joi.number().required(),
      allsale: Joi.number().required(),
    }),
    percent_platform: Joi.object({
      level_one: Joi.number().required(),
      level_two: Joi.number().required(),
      level_tree: Joi.number().required(),
      level_owner: Joi.number().required(),
    }),
    percent_terrestrial: Joi.object({
      district: Joi.number().required(),
      state: Joi.number().required(),
      province: Joi.number().required(),
      bonus: Joi.number().required(),
    }),
    percent_timestamp: Joi.array().default([]),
  });
  return schema.validate(data);
};

module.exports = { Percent, validate };
