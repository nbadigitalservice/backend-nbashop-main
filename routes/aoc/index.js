const router = require('express').Router();
const service = require("../../controllers/aoc.controller/aoc.order.service.controller");
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post('/token', service.getToken);
router.post('/ticketflight', service.getFlightTicket);

module.exports = router