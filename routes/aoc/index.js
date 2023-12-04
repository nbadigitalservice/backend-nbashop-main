const router = require('express').Router();
const service = require("../../controllers/aoc.controller/aoc.order.service.controller");
const IATA = require("../../controllers/aoc.controller/aoc.api.iata.controller");
const api = require("../../controllers/aoc.controller/aoc.api.service.controller.js");
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

//api IATA สนามบิน
router.post('/createiata', IATA.createIATA);
router.get('/iata', IATA.getIATA);
router.get('/iata/:id', IATA.getIATAById);
router.put('/iata/:id', IATA.updateIATAById);
router.delete('/iata/:id', IATA.deleteIATA);


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