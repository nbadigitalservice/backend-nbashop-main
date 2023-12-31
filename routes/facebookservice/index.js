const router = require("express").Router();
const facebookService = require('../../controllers/facebook.service.controller/facebook.service.controller')
const facebookOrder = require('../../controllers/facebook.service.controller/facebook.order.service.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/create", authAdmin, facebookService.create);
router.get("/list", auth, facebookService.GetAll);
router.get("/list/:id", auth, facebookService.GetById);
router.put("/update/:id", authAdmin, facebookService.update);
router.delete("/delete/:id", authAdmin, facebookService.delete);

//order
router.post("/order", auth, facebookOrder.order)

module.exports = router