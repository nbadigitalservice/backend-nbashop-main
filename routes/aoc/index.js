const router = require('express').Router();
const service = require("../../controllers/aoc.controller/aoc.order.service.controller");
const auth = require("../../lib/auth");
const authAOC = require("../../lib/auth.aoc");
const authAdmin = require('../../lib/auth.admin');

router.get('/iata',auth, service.getIATA);

router.post('/token',auth, service.getToken);
router.post('/ticketflight',auth, service.getFlightTicket);
router.post('/ticketprice',auth, service.getPriceTicket);
router.put('/pessenger', auth, service.putPassenger);

module.exports = router