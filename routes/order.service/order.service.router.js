const router = require("express").Router()
const authAdmin = require('../../lib/auth.admin')
const OrderStatus = require('../../controllers/order.service.controller/order.service.controller')
const auth = require("../../lib/auth");

router.put("/confirm/:id", authAdmin, OrderStatus.confirm)
router.put("/accept/:id", auth, OrderStatus.acceptTask)
router.put("/submit/:id", auth, OrderStatus.submit)
router.put("/cancel/:id", authAdmin, OrderStatus.cancel)
router.post("/deliver/:id", auth, OrderStatus.DeliverOrder)
router.get("/list", auth, OrderStatus.GetAll)
router.get("/list/:id", auth, OrderStatus.GetById)
router.get("/allsale", auth, OrderStatus.GetTotalPriceSumByTel)

router.put("/:id", authAdmin, OrderStatus.updateOrder);

// canceled order
router.get("/cancelorder/list", auth, OrderStatus.GetAllCanceledOrder)
router.get("/cancelorder/list/:id", auth, OrderStatus.GetCanceledOrderById)
router.get("/cancelorder/listbytel", auth, OrderStatus.GetCanceledOrderByTel)

//delete order
router.delete("/deleteorder/:id", authAdmin, OrderStatus.DeleteOrderById)
router.delete("/deleteorder/cancel/:id", authAdmin, OrderStatus.DeleteOrderCancel)

module.exports = router