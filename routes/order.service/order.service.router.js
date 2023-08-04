const router = require("express").Router()
const authAdmin = require('../../lib/auth.admin')
const OrderStatus = require('../../controllers/order.service.controller/order.service.controller')

router.put("/confirm", authAdmin, OrderStatus.confirm)
router.put("/complete", authAdmin, OrderStatus.complete)

module.exports = router