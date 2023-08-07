const router = require("express").Router();
const itsupportService = require('../../controllers/itsupport.service.controller/itsupport.service.controller')
const itsupportOrder = require('../../controllers/itsupport.service.controller/itsupport.order.service.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/create", authAdmin, itsupportService.create);
router.get("/list", auth, itsupportService.GetAll);
router.get("/list/:id", auth, itsupportService.GetById);
router.put("/update/:id", authAdmin, itsupportService.update);
router.delete("/delete/:id", authAdmin, itsupportService.delete);

//order
router.post("/order", auth, itsupportOrder.order)

module.exports = router