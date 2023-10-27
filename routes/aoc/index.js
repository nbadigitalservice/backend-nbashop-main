const router = require('express').Router();
const service = require("../../controllers/aoc.controller/aoc.order.service.controller");
const auth = require("../../lib/auth");
const authAOC = require("../../lib/auth.aoc");
const authAdmin = require('../../lib/auth.admin');

router.get('/iata',auth, service.getIATA);

// router.post('/token',auth, service.getToken);
router.post('/ticketflight',authAOC, service.getFlightTicket);

module.exports = router