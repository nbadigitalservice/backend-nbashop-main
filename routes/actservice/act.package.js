const router = require("express").Router();
const ActServicePackage = require('../../controllers/act.service.controller/act.service.package.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/create", authAdmin, ActServicePackage.create);
router.get("/list", auth, ActServicePackage.GetAll);
router.get("/list/:id", auth, ActServicePackage.GetById);
router.put("/update/:id", authAdmin, ActServicePackage.update);
router.delete("/delete/:id", authAdmin, ActServicePackage.delete);

module.exports = router