const router = require("express").Router();
const AccountServiceCategory = require('../../controllers/account.service.controller/account.service.category.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/create", authAdmin, AccountServiceCategory.create);
router.get("/list", auth, AccountServiceCategory.GetAll);
router.get("/list/:id", auth, AccountServiceCategory.GetById);
router.put("/update/:id", authAdmin, AccountServiceCategory.update);
router.delete("/delete/:id", authAdmin, AccountServiceCategory.delete);

module.exports = router