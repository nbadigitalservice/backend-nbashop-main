const axios = require("axios");
const {IATA} = require("../../models/aoc.service.model/iata.model");

//get Token
exports.getIATA = async (req, res) => {
  try {
    const IATA_list = await IATA.find();
    if (IATA_list) {
      return res.status(200).send({status: true, data: IATA_list});
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

//get ticket
exports.getFlightTicket = async (req, res) => {
  try {
    // const data = {
    //   tripType: req.body.tripType,
    //   originCode: req.body.originCode,
    //   destinationCode: req.body.destinationCode,
    //   airline: req.body.airline,
    //   svcClass: req.body.svcClass,
    //   directFlight: req.body.directFlight,
    //   departDate: req.body.departDate,
    //   returnDate: req.body.returnDate,
    //   adult: req.body.adult,
    //   child: req.body.child,
    //   infant: req.body.infant,
    //   languageCode: req.body.languageCode,
    // };
    const token = await axios.post(process.env.AOC_URL + "Token", {
      username: process.env.AOC_USERNAME,
      password: process.env.AOC_PASSWORD,
      grantType: "password",
    });
    const Token = token.data.accessToken;
    const ticketFlight = await axios.post(
      process.env.AOC_URL + "FlightSearchMultiTicket",
      {
        tripType: req.body.tripType,
        originCode: req.body.originCode,
        destinationCode: req.body.destinationCode,
        airline: req.body.airline,
        svcClass: req.body.svcClass,
        directFlight: req.body.directFlight,
        departDate: req.body.departDate,
        returnDate: req.body.returnDate,
        adult: req.body.adult,
        child: req.body.child,
        infant: req.body.infant,
        languageCode: req.body.languageCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    const data = ticketFlight.data.flights;
    if (data) {
      return res.status(200).send({status: true, data: data});
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};
