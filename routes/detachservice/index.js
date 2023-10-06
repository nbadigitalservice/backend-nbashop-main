const router = require('express').Router();
const Detachservice = require('../../controllers/detach.service.controller/detach.service.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/create", authAdmin, Detachservice.create);
router.get("/list", auth, Detachservice.GetAll);
router.get("/list/:id", auth, Detachservice.GetById);
router.put("/update/:id", authAdmin, Detachservice.update);
router.delete("/delete/:id", authAdmin, Detachservice.delete);

module.exports = router