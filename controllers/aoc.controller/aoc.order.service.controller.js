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
    const Token = await axios.post(process.env.AOC_URL + "Token", {
      username: process.env.AOC_USERNAME,
      password: process.env.AOC_PASSWORD,
      grantType: "password",
    });
    if (Token) {
      let token = Token.data.accessToken;
      const ticketFlight = await axios.post(
        process.env.AOC_URL + "FlightSearchMultiTicket",
        {
          ...req.body,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
            origin_data: req.body,
            data: ticket,
            pgSearchOID: ticketFlight.data.pgSearchOID,
          });
        } else {
          const ticket = ticketFlight_data.filter(
            (el) => el.isMultiTicket === true
          );
          return res.status(200).send({
            status: true,
            origin_data: req.body,
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
    const Token = await axios.post(process.env.AOC_URL + "Token", {
      username: process.env.AOC_USERNAME,
      password: process.env.AOC_PASSWORD,
      grantType: "password",
    });
    if (Token) {
      let token = Token.data.accessToken;
      const ticketPrice = await axios.post(
        process.env.AOC_URL + "FlightMultiTicketPricing",
        {
          ...req.body,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    const Token = await axios.post(process.env.AOC_URL + "Token", {
      username: process.env.AOC_USERNAME,
      password: process.env.AOC_PASSWORD,
      grantType: "password",
    });
    if (Token) {
      let token = Token.data.accessToken;
      const flight_booking = await axios.post(
        process.env.AOC_URL + "FlightBooking",
        {
          ...req.body,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!flight_booking.data.TransactionID) {
        return res
          .status(401)
          .send({status: false, message: "จองตั๋วไม่สำเร็จ"});
      }
      const invoice = await GenerateRiceiptNumber();
      const data = {
        invoice: invoice,
        transaction_id: flight_booking.data.TransactionID,
        contactInfo: req.body.contactInfo,
        total_cost: req.body.totalFare - req.body.totalCommission,
        total_commission: req.body.totalCommission,
        total: req.body.totalFare,
        status: {
          name: "รอการยืนยันจากลูกค้า",
          timestamp: dayjs(Date.now()).format(""),
        },
        timestamp: dayjs(Date.now()).format(""),
      };
      const new_ticket = new OrderFlightTicket(data);
      new_ticket.save();
      return res.status(200).send({
        status: true,
        message: "ทำรายการทำเร็จ",
        data: new_ticket,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getFlightBooking = async (req, res) => {
  try {
    const Token = await axios.post(process.env.AOC_URL + "Token", {
      username: process.env.AOC_USERNAME,
      password: process.env.AOC_PASSWORD,
      grantType: "password",
    });
    if (Token) {
      let token = Token.data.accessToken;
      const FlightBooking = await axios.post(
        process.env.AOC_URL + "GetFlightBooking",
        {
          bookingKeyReference: req.body.bookingKeyReference,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    const Token = await axios.post(process.env.AOC_URL + "Token", {
      username: process.env.AOC_USERNAME,
      password: process.env.AOC_PASSWORD,
      grantType: "password",
    });
    if (Token) {
      let token = Token.data.accessToken;
      const payment = await axios.post(
        process.env.AOC_URL + "UpdatePayment",
        {
          ...req.body,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(payment);
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

exports.confirmAOC = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await OrderFlightTicket.findOne({_id: id});
    if (updateStatus) {
      updateStatus.shop_id = req.body.shop_id;
      updateStatus.platform = req.body.platform;
      updateStatus.employee = req.body.employee;
      updateStatus.status.push({
        name: "รอตรวจสอบ",
        timestamp: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
    } else {
      return res.status(403).send({message: "เกิดข้อผิดพลาด"});
    }
    return res.status(200).send({
      status: true,
      message: "คอนเฟิร์มออร์เดอร์สำเร็จ",
      data: updateStatus,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

async function GenerateRiceiptNumber() {
  const order_ticket = await OrderFlightTicket.find();
  const count = order_ticket.lenght > 0 ? order_ticket[0].count + 1 : 1;
  const data = `AOC${dayjs(Date.now()).format("YYYYMMDD")}${count
    .toString()
    .padStart(5, "0")}`;
  return data;
}
