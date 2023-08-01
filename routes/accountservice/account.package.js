const router = require("express").Router();
const AccountServicePackage = require('../../controllers/account.service.controller/account.service.package.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/create", authAdmin, AccountServicePackage.create);
router.get("/list", auth, AccountServicePackage.GetAll);
router.get("/list/:id", auth, AccountServicePackage.GetById);
router.put("/update/:id", authAdmin, AccountServicePackage.update);
router.delete("/delete/:id", authAdmin, AccountServicePackage.delete);

module.exports = router