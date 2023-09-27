const router = require('express').Router();
const service = require("../../controllers/aoc.controller/aoc.order.service.controller")
const auth = require("../../lib/auth");
const authAoc = require("../../lib/auth.aoc");
const authAdmin = require('../../lib/auth.admin')

router.get('/token', service.getAocService);
// router.get('/airplane', service.getAllService);

module.exports = router