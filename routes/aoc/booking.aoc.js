const router = require('express').Router();
const service = require("../../controllers/aoc.controller/aoc.order.service.controller.js");
const api = require("../../controllers/aoc.controller/aoc.api.service.controller.js");
const auth = require("../../lib/auth.js");
const authAdmin = require('../../lib/auth.admin.js');

router.post('/ticketflight',auth, service.getFlightTicket); //ค้นหาเที่ยวบิน
router.post('/ticketprice',auth, service.getPriceTicket); //เชคราคาเที่ยวบิน
router.post('/booking',auth, service.getBooking); //ทำการจอง
router.post('/flightbooking', auth, service.getFlightBooking);
router.post('/updatapayment', auth, service.updatePayment); 

router.put('/confirm/:id', service.confirmAOC);

module.exports = router