const router = require('express').Router();
const service = require("../../controllers/aoc.controller/aoc.order.service.controller");
const auth = require("../../lib/auth");
const authAOC = require("../../lib/auth.aoc");
const authAdmin = require('../../lib/auth.admin');

router.get('/iata',auth, service.getIATA);

router.post('/token', service.getToken);
router.post('/ticketflight', service.getFlightTicket);
router.post('/ticketprice', service.getPriceTicket);

module.exports = router