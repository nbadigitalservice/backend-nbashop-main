const {airline_code} = require("../../models/aoc.api.model/airline.model");
const {airport_code} = require("../../models/aoc.api.model/airport.model.js");
const {
  airportinfo,
} = require("../../models/aoc.api.model/airportinfo.model.js");
const {city} = require("../../models/aoc.api.model/city.model.js");
const {country} = require("../../models/aoc.api.model/country.model.js");
const {equipment} = require("../../models/aoc.api.model/equipment.model.js");

exports.getAirline = async (req, res) => {
  try {
    const airline = await airline_code.find();
    if (airline) {
      return res.status(200).send({
        message: "ดึงข้อมูลสำเร็จ",
        status: true,
        data: airline,
      });
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getAirport = async (req, res) => {
  try {
    const airport = await airport_code.find();
    if (airport) {
      return res.status(200).send({
        message: "ดึงข้อมูลสำเร็จ",
        status: true,
        data: airport,
      });
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getAirportinfo = async (req, res) => {
  try {
    const airport_info = await airportinfo.find();
    if (airport_info) {
      return res.status(200).send({
        message: "ดึงข้อมูลสำเร็จ",
        status: true,
        data: airport_info,
      });
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getCity = async (req, res) => {
  try {
    const city_data = await city.find();
    if (city_data) {
      return res.status(200).send({
        message: "ดึงข้อมูลสำเร็จ",
        status: true,
        data: city_data,
      });
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getCountry = async (req, res) => {
  try {
    const country_data = await country.find();
    if (country_data) {
      return res.status(200).send({
        message: "ดึงข้อมูลสำเร็จ",
        status: true,
        data: country_data,
      });
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getEquipment = async (req, res) => {
  try {
    const equipment_data = await equipment.find();
    if (equipment_data) {
      return res.status(200).send({
        message: "ดึงข้อมูลสำเร็จ",
        status: true,
        data: equipment_data,
      });
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
