const axios = require("axios");
const {IATA} = require("../../models/aoc.service.model/iata.model");
const {
  valiTicket,
} = require("../../models/aoc.service.model/aoc.tricket.model");

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
          Cookie: process.env.AOC_COOKIE,
        },
      }
    );
    const ticketFlight_data = ticketFlight.data;
    if (ticketFlight_data) {
      return res.status(200).send({
        message: "ดึงข้อมูลเที่ยวบินสำเร็จ",
        status: true,
        data: ticketFlight_data,
      });
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลเที่ยวบินไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

//get Price Ticket
exports.getPriceTicket = async (req, res) => {
  try {
    const Token = req.body.token;
    const ticketPrice = await axios.post(
      process.env.AOC_URL + "FlightMultiTicketPricing",
      {
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
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Cookie: process.env.AOC_COOKIE,
        },
      }
    );
    const ticketPrice_data = ticketPrice.data.flights;
    if (ticketPrice_data) {
      return res.status(200).send({
        message: "ดึงข้อมูลราคาเที่ยวบินสำเร็จ",
        status: true,
        data: ticketPrice_data,
      });
    } else {
      return res
        .status(400)
        .send({message: "ดึงข้อมูลเที่ยวบินไม่สำเร็จ", status: false});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

//put Passenger
exports.putPassenger = async (req, res) => {
  try {
    const token = req.body.token;
    const data = {
      FlightBookingPaxInfoOID: req.body.FlightBookingPaxInfoOID,
      paxType: req.body.paxType,
      title: req.body.title,
      firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      birthday: req.body.birthday,
      email: req.body.email,
      telNo: req.body.telNo,
      passportNumber: req.body.passportNumber,
      passportIssuingDate: req.body.passportIssuingDate,
      passportExpiryDate: req.body.passportExpiryDate,
      passportIssuingCountry: req.body.passportIssuingCountry,
      passportNationality: req.body.passportNationality,
      frequentFlyList: req.body.frequentFlyList,
      seatRequest: req.body.seatRequest,
      seatsRequest: req.body.seatsRequest,
      mealRequest: req.body.mealRequest,
      travelWithAdultID: req.body.travelWithAdultID,
      ticketNumber: req.body.ticketNumber,
      netRefund: req.body.netRefund,
      agentRefund: req.body.agentRefund,
      refundAmount: req.body.refundAmount,
      tickNoRefund: req.body.tickNoRefund,
      remarkRefund: req.body.remarkRefund,
      StatusRefund: req.body.StatusRefund,
      netReissue: req.body.netReissue,
      agentReissue: req.body.agentReissue,
      reissueSelling: req.body.reissueSelling,
      tickNoReissueOld: req.body.tickNoReissueOld,
      tickNoReissueNew: req.body.tickNoReissueNew,
      remarkReissue: req.body.remarkReissue,
      StatusReissue: req.body.StatusReissue,
      kiwiBag: req.body.kiwiBag,
      kiwiBagPrice: req.body.kiwiBagPrice,
      kiwiBagWeight: req.body.kiwiBagWeight,
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
