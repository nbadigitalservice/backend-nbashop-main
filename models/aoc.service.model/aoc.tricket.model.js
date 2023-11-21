const mongoose = require("mongoose");
const Joi = require("joi");

const flightTicketSchema = new mongoose.Schema({
  TransactionID: {type: String, required: true},
  Booking: {type: Array, required: true},
  status: [
    {
      name: {type: String, required: true},
      timestamp: {type: String, required: true},
    },
  ],
  timestamp: {type: String, required: true},
});

const OrderFlightTicket = new mongoose.model("order_ticket", flightTicketSchema);

const valiTicket = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    pgSearchOID: Joi.string().required().label("ไม่พบ ID"),
    tripType: Joi.string().required().label("ไม่พบประเภทการบิน"),
    origin: Joi.string().required().label("ไม่พบ Code เที่ยวบนขาไป"),
    destination: Joi.string().required().label("ไม่พบ Code เที่ยวบนขากลับ"),
    adult: Joi.string().required(),
    child: Joi.string().required(),
    infant: Joi.number().required(),
    svcClass: Joi.number().required().label("ไม่พบ Service Class"),
    S1: Joi.number().required().label("ไม่พบ Booking Code ขาไป"),
    s2: Joi.number().required().label("ไม่พบ Booking Code ขากลับ"),
    bMultiTicket_Fare: Joi.number().required(),
    languageCode: Joi.number().required(),
  });
  return schema.valiTicket(data);
};

module.exports = {OrderFlightTicket, valiTicket};