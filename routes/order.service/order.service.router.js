const router = require("express").Router()
const authAdmin = require('../../lib/auth.admin')
const OrderStatus = require('../../controllers/order.service.controller/order.service.controller')
const auth = require("../../lib/auth");

router.put("/confirm/:id", authAdmin, OrderStatus.confirm)
router.put("/accept/:id", auth, OrderStatus.acceptTask)
router.put("/cancel/:id", authAdmin, OrderStatus.cancel)
router.get("/list", auth, OrderStatus.GetAll)
router.get("/list/:id", auth, OrderStatus.GetById)
router.get("/allsale/:tel", auth, OrderStatus.GetTotalPriceSumByTel)

module.exports = router