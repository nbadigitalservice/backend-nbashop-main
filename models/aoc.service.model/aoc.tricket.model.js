const mongoose = require("mongoose");
const Joi = require("joi");

const flightTicketSchema = new mongoose.Schema({
  shop_id: {type: String, required: false, default: ""},
  platform: {type: String, required: false, default: ""},
  invoice: {type: String, required: false, default: "ไม่มี"},
  total_cost: {type: Number, required: false, default: 0},
  total_commission: {type: Number, required: true},
  total: {type: Number, required: true},
  transaction_id: {type: String, required: true, default: "ไม่มี"},
  contactInfo: {type: Array, default: []},
  employee: {type: String, required: false, default: ""},
  status: {type: Array, default: []},
  timestamp: {type: String, required: true},
});

const OrderFlightTicket = new mongoose.model(
  "order_ticket",
  flightTicketSchema
);

const valiTicket = (data) => {
  const schema = Joi.object({
    shop_id: Joi.string().required().label("ไม่พบ shop_id"),
    platform_tel: Joi.string().default(""),
    invoice: Joi.string().default("ไม่มี"),
    invoice_full: Joi.string().default("ไม่มี"),
    total: Joi.number().required().label("ไม่พบยอดรวมในใบเสร็จ"),
    total_commission: Joi.number().required().label("ไม่พบค่าคอมมิชชั่น"),
    total_cost: Joi.number.default(0),
    transaction_id: Joi.string().default("ไม่มี"),
    booking: Joi.array(),
    employee: Joi.string().required().label("ไม่พบพนักงานทำรายการ"),
    status: Joi.array(),
    timestamp: Joi.string(),
  });
  return schema.valiTicket(data);
};

module.exports = {OrderFlightTicket, valiTicket};
