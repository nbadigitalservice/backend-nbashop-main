const router = require('express').Router();
const service = require("../../controllers/aoc.controller/aoc.order.service.controller");
const api = require("../../controllers/aoc.controller/aoc.api.service.controller.js");
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');
const aoc = require("../../lib/auth.aoc");

router.get('/iata',auth, service.getIATA);

router.post('/token',auth, service.getToken); //ดึง token ก่อน
router.post('/admin/token',authAdmin, service.getToken);
router.post('/ticketflight',auth, service.getFlightTicket); //ค้นหาเที่ยวบิน
router.post('/ticketprice',auth, service.getPriceTicket); //เชคราคาเที่ยวบิน
router.post('/booking',auth, service.getBooking); //ทำการจอง
router.get('/flightbooking', auth, service.getFlightBooking);
router.get('/admin/flightbooking', authAdmin, service.getFlightBooking); //ดึงข้อมูลที่ทำการจอง
router.post('/updatapayment', auth, service.updatePayment); 

router.get('/order/ticket',auth, service.getOrderTicket);

// api
router.get('/api/airline', auth, api.getAirline);
router.get('/api/airport', auth, api.getAirport);
router.get('/api/airportinfo', auth, api.getAirportinfo);
router.get('/api/city', auth, api.getCity);
router.get('/api/country', auth, api.getCountry);
router.get('/api/equipment', auth, api.getEquipment);

module.exports = router