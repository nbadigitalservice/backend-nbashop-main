const router = require("express").Router();
const ActServiceCategory = require('../../controllers/act.service.controller/act.service.category.controller')
const ActServicePackage = require('../../controllers/act.service.controller/act.service.package.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

//category
router.post("/category/create", authAdmin, ActServiceCategory.create);
router.get("/category/list", auth, ActServiceCategory.GetAll);
router.get("/category/list/:id", auth, ActServiceCategory.GetById);
router.put("/category/update/:id", authAdmin, ActServiceCategory.update);
router.delete("/category/delete/:id", authAdmin, ActServiceCategory.delete);

//package
router.post("/package/create", authAdmin, ActServicePackage.create);
router.get("/package/list", auth, ActServicePackage.GetAll);
router.get("/package/list/:id", auth, ActServicePackage.GetById);
router.put("/package/update/:id", authAdmin, ActServicePackage.update);
router.delete("/package/delete/:id", authAdmin, ActServicePackage.delete);

module.exports = router