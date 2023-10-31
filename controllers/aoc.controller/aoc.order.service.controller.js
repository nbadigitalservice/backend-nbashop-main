const axios = require("axios");
const {IATA} = require("../../models/aoc.service.model/iata.model");
const {
  OrderFlightTicket,
} = require("../../models/aoc.service.model/aoc.tricket.model");
const dayjs = require("dayjs");

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
    const ticketFlight_data = ticketFlight.data.flights;
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
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getBooking = async (req, res) => {
  try {
    const Token = req.body.token;
    const flight_booking = await axios.post(
      process.env.AOC_URL + "FlightBooking",
      {
        adtFare: req.body.adtFare,
        chdFare: req.body.chdFare,
        infFare: req.body.infFare,
        depFlight: req.body.depFlight,
        retFlight: req.body.retFlight,
        multiFlight: req.body.multiFlight,
        origin: req.body.origin,
        destination: req.body.destination,
        noOfAdults: req.body.noOfAdults,
        noOfChildren: req.body.noOfChildren,
        noOfInfants: req.body.noOfInfants,
        svc_class: req.body.svc_class,
        grandTotal: req.body.grandTotal,
        refund: req.body.refund,
        reissue: req.body.reissue,
        isPassportRequired: req.body.isPassportRequired,
        PNR: req.body.PNR,
        iRoute: req.body.iRoute,
        TransactionID: req.body.TransactionID,
        bookingURN: req.body.bookingURN,
        promotionGroupCode: req.body.promotionGroupCode,
        statusPayment: req.body.statusPayment,
        paymentMethod: req.body.paymentMethod,
        paymentDate: req.body.paymentDate,
        statusBooking: req.body.statusBooking,
        paymentType: req.body.paymentType,
        paymentValue: req.body.paymentValue,
        bookingOID: req.body.bookingOID,
        contactInfo: req.body.contactInfo,
        adtPaxs: req.body.adtPaxs,
        chdPaxs: req.body.chdPaxs,
        infPaxs: req.body.infPaxs,
        isPricingWithSegment: req.body.isPricingWithSegment,
        bookingDate: req.body.bookingDate,
        remarks: req.body.remarks,
        sourceBy: req.body.sourceBy,
        totalFare: req.body.totalFare,
        totalCommission: req.body.totalCommission,
        fareRules: req.body.fareRules,
        isError: req.body.isError,
        errorCode: req.body.errorCode,
        errorMessage: req.body.errorMessage,
        uuid: req.body.uuid,
        userID: req.body.userID,
        memberOID: req.body.memberOID,
        source: req.body.source,
        installmentMonthlyPaid: req.body.installmentMonthlyPaid,
        installmentPlan: req.body.installmentPlan,
        finalPrice: req.body.finalPrice,
        promotionCode: req.body.promotionCode,
        promotionName: req.body.promotionName,
        promotionDiscount: req.body.promotionDiscount,
        corporateCode: req.body.corporateCode,
        isDomestic: req.body.isDomestic,
        isTicketedComplete: req.body.isTicketedComplete,
        TicketedDateTime: req.body.TicketedDateTime,
        FlightBookingItineraryOID: req.body.FlightBookingItineraryOID,
        pgSearchOID: req.body.pgSearchOID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Cookie: process.env.AOC_COOKIE,
        },
      }
    );
    const data = {
      TransactionID: flight_booking.data.TransactionID,
      Booking: flight_booking.data.Booking,
      status: {
        name: "รอการตรวจสอบ",
        timestamp: dayjs(Date.now()).format(""),
      },
      timestamp: dayjs(Date.now()).format(""),
    };
    const order_flightticket = new OrderFlightTicket(data);
    order_flightticket.save(async (error, data) => {
      if (data) {
        return res.status(200).send({
          message: "จองตั๋วเครื่องบินสำเร็จ",
          status: true,
          data: data,
        });
      } else {
        return res
          .status(400)
          .send({message: "จองตั๋วเครื่องบินสำเร็จ", status: false});
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.getFlightBooking = async (req, res) => {
  try {
    const bookingKeyReference = req.body.bookingKeyReference;
    const Token = req.body.token;
    const FlightBooking = await axios.post(
      process.env.AOC_URL + "GetFlightBooking",
      {
        bookingKeyReference: bookingKeyReference,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
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
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const Token = req.body.token;
    const payment = await axios.post(
      process.env.AOC_URL + "UpdatePayment",
      {
        bookingKeyReference: req.body.bookingKeyReference,
        paymentStatus: req.body.paymentStatus,
        paymentReference: req.body.paymentReference,
        remark: req.body.remark,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Cookie: process.env.AOC_COOKIE,
        },
      }
    );
    const data = payment.data;
    if (data) {
      return res.status(200).send({
        message: "บันทึกข้อมูลสำเร็จ",
        status: true,
        data: data,
      });
    } else {
      return res
        .status(400)
        .send({message: "บันทึกข้อมูลไม่สำเร็จ", status: false});
    }
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
