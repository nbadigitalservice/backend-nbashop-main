const mongoose = require("mongoose");
const Joi = require("joi");

const ProductNBASchema = new mongoose.Schema({
  productNBA_brand_id: { type: String, required: false, default: "ไม่มี" },
  // เพิ่ม Dealer _id
  productNBA_dealer_id: { type: String, required: false, default: "ไม่มี" },
  productNBA_shop_id: { type: String, required: false, default: "ไม่มี" },
  productNBA_type: { type: Array, required: false, default: [] },
  productNBA_name: { type: String, required: true }, //
  productNBA_barcode: { type: String, required: false, default: "" },
  productNBA_image: { type: String, required: false, default: "" }, //
  productNBA_cost_nba: { type: Number, required: true }, // dealer ขายให้เรา
  productNBA_cost: { type: Number, required: true }, // dealer ขายให้เรา
  productNBA_price: { type: Number, required: true }, //
  productNBA_profit: {
    nba: { type: Number, required: true, default: 0 },
    platform: {
      level_one: { type: Number, required: true, default: 0 },
      level_two: { type: Number, required: true, default: 0 },
      level_tree: { type: Number, required: true, default: 0 },
      level_owner: { type: Number, required: true, default: 0 },
    },
    terrestrial: {
      // district: { type: Number, required: true, default: 0 },
      // state: { type: Number, required: true, default: 0 },
      // province: { type: Number, required: true, default: 0 },
      bonus: { type: Number, required: true, default: 0 },
    },
    central: {
      central: { type: Number, required: true, default: 0 },
      allsale: { type: Number, required: true, default: 0 },
    },
  },
  productNBA_status: { type: Boolean, required: false, default: true },
  productNBA_status_type: { type: String, required: false, default: "เครดิต" },
  productNBA_detail: { type: String, required: false, default: "" },
  productNBA_stock: { type: Number, required: true }, //
  productNBA_store: { type: String, required: false, default: "dealer" }, //
  productNBA_date_start: { type: Date, required: false, default: Date.now() }, // เริ่ม
  productNBA_vat_status: { type: Boolean, required: false, default: true }, // เพิ่ม
  productNBA_pack_status : {type: Boolean, required: false, default: false}, // false คือ ไม่มีการขายแบบลัง true คือ มีการขายย่อยและลัง
  productNBA_unit_ref : {
    barcode : {type: String, required: false, default: ""},
    amount : {type: Number, required: false, default : 0}
  },
  productNBA_alcohol_status :{ type: Boolean, required: false, default: false},
  productNBA_category : {type:String, required: false, default: ""},
  productNBA_more : {
    difference : {type:Number, required: false, default : 0},
    vat_sell : {type: Number, required: false, default : 0},
    vat_buy : {type: Number ,required: false, default: 0},
  }
});

const ProductNBA = mongoose.model("product_nba", ProductNBASchema);

const validate = (data) => {
  const schema = Joi.object({
    productNBA_brand_id: Joi.string().default("ไม่มี"),
    productNBA_dealer_id: Joi.string().default("ไม่มี"),
    productNBA_shop_id: Joi.string().default("ไม่มี"),
    productNBA_type: Joi.array().default([]),
    productNBA_name: Joi.string().required(),
    productNBA_barcode: Joi.string().default(""),
    productNBA_image: Joi.string().default(""),
    productNBA_cost_nba: Joi.number().required(),
    productNBA_cost: Joi.number().required(),
    productNBA_price: Joi.number().required(),
    productNBA_profit: Joi.object({
      nba: Joi.number().required().default(0),
      platform: Joi.object({
        level_one: Joi.number().required().default(0),
        level_two: Joi.number().required().default(0),
        level_tree: Joi.number().required().default(0),
        level_owner: Joi.number().required().default(0),
      }),
      terrestrial: Joi.object({
        // district: Joi.number().required().default(0),
        // state: Joi.number().required().default(0),
        // province: Joi.number().required().default(0),
        bonus: Joi.number().required().default(0),
      }),
      central: Joi.object({
        central: Joi.number().required().default(0),
        allsale: Joi.number().required().default(0),
      }),
    }),
    productNBA_status: Joi.boolean().default(true),
    productNBA_status_type: Joi.string().default("เครดิต"),
    productNBA_detail: Joi.string().default(""),
    productNBA_stock: Joi.number().required(), // default 0
    productNBA_store: Joi.string().default("dealer"),
    productNBA_date_start: Joi.date().raw().default(Date.now()),
    productNBA_vat_status: Joi.boolean().default(true),
    productNBA_pack_status : Joi.boolean().default(false),
    productNBA_unit_ref : Joi.object({
      barcode : Joi.string().default(""),
      amount : Joi.number().default(0)
    }),
    productNBA_alcohol_status : Joi.boolean().default(false),
    productNBA_category : Joi.string().default(''),
    productNBA_more: {
      difference : Joi.number().default(0),
      vat_sell : Joi.number().default(0),
      vat_buy : Joi.number().default(0)
    }
  });
  return schema.validate(data);
};

module.exports = { ProductNBA, validate };
