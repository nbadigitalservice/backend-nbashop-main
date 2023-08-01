const router = require("express").Router();
const ActServiceCategory = require('../../controllers/act.service.controller/act.service.category.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/create", authAdmin, ActServiceCategory.create);
router.get("/list", auth, ActServiceCategory.GetAll);
router.get("/list/:id", auth, ActServiceCategory.GetById);
router.put("/update/:id", authAdmin, ActServiceCategory.update);
router.delete("/delete/:id", authAdmin, ActServiceCategory.delete);

module.exports = router