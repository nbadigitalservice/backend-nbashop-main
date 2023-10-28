const axios = require("axios");
const {IATA} = require("../../models/aoc.service.model/iata.model");

//get Token
exports.getToken = async (req, res) => {
  try {
    const token = await axios.post(process.env.AOC_URL + "Token", {
      username: process.env.AOC_USERNAME,
      password: process.env.AOC_PASSWORD,
      grantType: "password",
    });
    const Token = token.data;
    if (Token) {
      return res.status(200).send({status: true, data: Token});
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

//get ตัวย่อสนามบิน
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
    const Token = req.body.token;
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

//get Price Ticket
exports.getPriceTicket = async (req, res) => {
  try {
    const data = {
      token: req.body.token,
      pgSearchOID: req.body.pgSearchOID,
      tripType: req.body.tripType,
      origin: req.body.origin,
      destination: req.body.destination,
      adult: req.body.adult,
      child: req.body.child,
      infant: req.body.infant,
      svcClass: req.body.svcClass,
      S1: req.body.S1,
      S2: req.body.S2,
      bMultiTicket_Fare: req.body.bMultiTicket_Fare,
      languageCode: req.body.languageCode,
    };
    console.log(data);
    const Token = req.body.token;
    // const priceTicket = await axios.post(
    //   process.env.AOC_URL + "FlightMultiTicketPricing",
    //   {
    //     pgSearchOID: req.body.pgSearchOID,
    //     tripType: req.body.tripType,
    //     origin: req.body.origin,
    //     destination: req.body.destination,
    //     adult: req.body.adult,
    //     child: req.body.child,
    //     infant: req.body.infant,
    //     svcClass: req.body.svcClass,
    //     S1: req.body.S1,
    //     child: req.body.S2,
    //     bMultiTicket_Fare: req.body.bMultiTicket_Fare,
    //     languageCode: req.body.languageCode,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${Token}`,
    //     },
    //   }
    // );
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
