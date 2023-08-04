const router = require("express").Router()
const WebsiteService = require('../../controllers/website.service.controller/website.service.controller')
const WebsiteServiceOrder = require('../../controllers/website.service.controller/website.service.order.controlder')
const auth = require("../../lib/auth")
const authAdmin = require('../../lib/auth.admin')

router.post("/create", authAdmin, WebsiteService.create)
router.get("/list", auth, WebsiteService.GetAll)
router.get("/list/:id", auth, WebsiteService.GetById)
router.put("/update/:id", authAdmin, WebsiteService.update)
router.delete("/delete/:id", authAdmin, WebsiteService.delete)

//order
router.post("/order", auth, WebsiteServiceOrder.order)
router.put("/order/confirm", authAdmin, WebsiteServiceOrder.confirm)
router.put("/order/complete", authAdmin, WebsiteServiceOrder.complete)

module.exports = router