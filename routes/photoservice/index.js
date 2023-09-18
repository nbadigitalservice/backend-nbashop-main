const router = require("express").Router();
const Photoservice = require('../../controllers/photo.service.controller/photo.service.controller')
const PhotoOrder = require('../../controllers/photo.service.controller/photo.order.service.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/create", authAdmin, Photoservice.create);
router.get("/list", auth, Photoservice.GetAll);
router.get("/list/:id", auth, Photoservice.GetById);
router.put("/update/:id", authAdmin, Photoservice.update);
router.delete("/delete/:id", authAdmin, Photoservice.delete);

//order
router.post("/order", auth, PhotoOrder.order)

module.exports = router