const router = require("express").Router();
const InsuranceServiceCategory = require('../../controllers/insurance.service.controller/insurance.service.category.controller')
const InsuranceServicePackage = require('../../controllers/insurance.service.controller/insurance.service.package.controller')
const InsuranceOrder = require('../../controllers/insurance.service.controller/insurance.service.order.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

//category
router.post("/category/create", authAdmin, InsuranceServiceCategory.create);
router.get("/category/list", auth, InsuranceServiceCategory.GetAll);
router.get("/category/list/:id", auth, InsuranceServiceCategory.GetById);
router.put("/category/update/:id", authAdmin, InsuranceServiceCategory.update);
router.delete("/category/delete/:id", authAdmin, InsuranceServiceCategory.delete);

//package
router.post("/package/create", authAdmin, InsuranceServicePackage.create);
router.get("/package/list", auth, InsuranceServicePackage.GetAll);
router.get("/package/list/:id", auth, InsuranceServicePackage.GetById);
router.get("/package/listbycate/:id", auth, InsuranceServicePackage.GetByCateId);
router.put("/package/update/:id", authAdmin, InsuranceServicePackage.update);
router.delete("/package/delete/:id", authAdmin, InsuranceServicePackage.delete);

//order
router.post("/order", auth, InsuranceOrder.order)

module.exports = router