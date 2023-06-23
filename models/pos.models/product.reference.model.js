const mongoose = require("mongoose");
const Joi = require("joi");

const ProductRefSchema = new mongoose.Schema({
  productRef_profit: {
    nba: { type: Number, required: true },
    platform: {
      level_one: { type: Number, required: true },
      level_two: { type: Number, required: true },
      level_tree: { type: Number, required: true },
      level_owner: { type: Number, required: true },
    },
    terrestrial: {
      district: { type: Number, required: true },
      state: { type: Number, required: true },
      province: { type: Number, required: true },
    },
    bonus: { type: Number, required: true },
    central: { type: Number, required: true },
  },

  ProductRef_product_id: { type: String, required: true },
  ProductRef_shop_id: { type: String, required: true },
  ProductRef_status: { type: String, required: false, default: "ไม่เก็บ" },
  productRef_total_profit: { type: Number, required: true },
  productRef_timestamp: { type: Date, required: false, default: Date.now() },
});

const ProductRef = mongoose.model("product_reference", ProductRefSchema);

const validate = (data) => {
  const schema = Joi.object({
    productRef_profit: Joi.object({
      nba: Joi.number().required(),
      platform: Joi.object({
        level_one: Joi.number().required(),
        level_two: Joi.number().required(),
        level_tree: Joi.number().required(),
        level_owner: Joi.number().required(),
      }),
      terrestrial: Joi.object({
        district: Joi.number().required(),
        state: Joi.number().required(),
        province: Joi.number().required(),
      }),
      bonus: Joi.number().required(),
      central: Joi.number().required(),
    }),
    ProductRef_shop_id: Joi.string().required(),
    ProductRef_product_id: Joi.string().required(),
    ProductRef_status: Joi.string().default("ไม่เก็บ"),
    productRef_total_profit: Joi.number().required(),
    productRef_timestamp: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { ProductRef, validate };
