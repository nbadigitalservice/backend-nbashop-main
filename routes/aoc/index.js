const router = require('express').Router();
const service = require("../../controllers/aoc.controller/aoc.order.service.controller");
const api = require("../../controllers/aoc.controller/aoc.api.service.controller.js");
const auth = require("../../lib/auth");
const authAOC = require("../../lib/auth.aoc");
const authAdmin = require('../../lib/auth.admin');

router.get('/iata',auth, service.getIATA);

router.post('/token',auth, service.getToken);
router.post('/ticketflight',auth, service.getFlightTicket);
router.post('/ticketprice',auth, service.getPriceTicket);
router.put('/pessenger', auth, service.putPassenger);


// api
router.get('/api/airline', auth, api.getAirline);
router.get('/api/airport', auth, api.getAirport);
router.get('/api/airportinfo', auth, api.getAirportinfo);
router.get('/api/city', auth, api.getCity);
router.get('/api/country', auth, api.getCountry);
router.get('/api/equipment', auth, api.getEquipment);

module.exports = router