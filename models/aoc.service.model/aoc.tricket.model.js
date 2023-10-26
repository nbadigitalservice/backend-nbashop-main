const mongoose = require("mongoose");
const Joi = require("joi");

const valiTicket = (data) => {
  const schema = Joi.object({
    tripType: Joi.string().required().label(""),
    originCode: Joi.string().required().label(""),
    destinationCode: Joi.string().required().label(""),
    airline: Joi.string().required().label(""),
    directFlight: Joi.string().default(false),
    departDate: Joi.date().required().label(""),
    returnDate: Joi.date().required().label(""),
    adult: Joi.number().required().label(""),
    child: Joi.number().required().label(""),
    infant: Joi.number().required().label(""),
    languageCode: Joi.string().required().label(""),
  });
  return schema.valiTicket(data);
};

module.exports = {valiTicket};
