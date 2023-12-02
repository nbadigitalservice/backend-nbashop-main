const axios = require("axios");
const {IATA} = require("../../models/aoc.service.model/iata.model");
const {
  OrderFlightTicket,
} = require("../../models/aoc.service.model/aoc.tricket.model");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

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
    let token = req.headers["auth-aoc"];
    if (token) {
      token = token.replace(/^Bearer\s+/, "");
      const ticketFlight = await axios.post(
        process.env.AOC_URL + "FlightSearchMultiTicket",
        {
          ...req.body,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: process.env.AOC_COOKIE,
          },
        }
      );
      const ticketFlight_data = ticketFlight.data.flights;
      if (ticketFlight_data) {
        if (req.body.tripType === "R") {
          const ticket = ticketFlight_data.filter(
            (el) => el.isMultiTicket === false
          );
          return res.status(200).send({
            status: true,
            message: "ดึงข้อมูลเที่ยวบินสำเร็จ",
            data: ticket,
            pgSearchOID: ticketFlight.data.pgSearchOID,
          });
        } else {
          const ticket = ticketFlight_data.filter(
            (el) => el.isMultiTicket === true
          );
          return res.status(200).send({
            status: true,
            message: "ดึงข้อมูลเที่ยวบินสำเร็จ",
            data: ticket,
            pgSearchOID: ticketFlight.data.pgSearchOID,
          });
        }
      } else {
        return res
          .status(400)
          .send({message: "ดึงข้อมูลเที่ยวบินไม่สำเร็จ", status: false});
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

//get Price Ticket
exports.getPriceTicket = async (req, res) => {
  try {
    let token = req.headers["auth-aoc"];
    if (token) {
      token = token.replace(/^Bearer\s+/, "");
      const ticketPrice = await axios.post(
        process.env.AOC_URL + "FlightMultiTicketPricing",
        {
          ...req.body,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: process.env.AOC_COOKIE,
          },
        }
      );
      const ticketPrice_data = ticketPrice.data;
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
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getBooking = async (req, res) => {
  try {
    let token = req.headers["auth-aoc"];
    if (token) {
      token = token.replace(/^Bearer\s+/, "");
      const flight_booking = await axios.post(
        process.env.AOC_URL + "FlightBooking",
        {
          ...req.body,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: process.env.AOC_COOKIE,
          },
        }
      );
      if (!flight_booking) {
        return res
          .status(401)
          .send({status: false, message: "จองตั๋วไม่สำเร็จ"});
      } else {
        return res
          .status(200)
          .send({
            status: true,
            message: "จองตั๋วสำเร็จ",
            data: flight_booking.data,
          });
      }

      // const order_flightticket = new OrderFlightTicket(data);
      // order_flightticket.save(async (error, data) => {
      //   if (data) {
      //     return res.status(200).send({
      //       message: "จองตั๋วเครื่องบินสำเร็จ",
      //       status: true,
      //       data: data,
      //     });
      //   } else {
      //     return res.status(400).send({
      //       message: "จองตั๋วเครื่องบินไม่สำเร็จ",
      //       status: false,
      //       error,
      //     });
      //   }
      // });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getFlightBooking = async (req, res) => {
  try {
    let token = req.headers["auth-aoc"];
    if (token) {
      token = token.replace(/^Bearer\s+/, "");
      const FlightBooking = await axios.post(
        process.env.AOC_URL + "GetFlightBooking",
        {
          bookingKeyReference: req.body.bookingKeyReference,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: process.env.AOC_COOKIE,
          },
        }
      );
      const data = FlightBooking.data;
      if (data) {
        return res.status(200).send({
          message: "ดึงข้อมูลตั๋วเครื่องบินสำเร็จ",
          status: true,
          data: data,
        });
      } else {
        return res
          .status(400)
          .send({message: "ดึงข้อมูลตั๋วเครื่องบินไม่สำเร็จ", status: false});
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.updatePayment = async (req, res) => {
  try {
    let token = req.headers["auth-aoc"];
    if (token) {
      token = token.replace(/^Bearer\s+/, "");
      const payment = await axios.post(
        process.env.AOC_URL + "UpdatePayment",
        {
          ...req.body,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: process.env.AOC_COOKIE,
          },
        }
      );
      console.log(payment.data);
    }

    // const data = payment.data;
    // if (data) {
    //   return res.status(200).send({
    //     message: "บันทึกข้อมูลสำเร็จ",
    //     status: true,
    //     data: data,
    //   });
    // } else {
    //   return res
    //     .status(400)
    //     .send({message: "บันทึกข้อมูลไม่สำเร็จ", status: false});
    // }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getOrderTicket = async (req, res) => {
  try {
    const order_ticket = await OrderFlightTicket.find();
    return res
      .status(200)
      .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: order_ticket});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", error: "server side error"});
  }
};
