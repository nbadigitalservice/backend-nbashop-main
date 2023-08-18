const router = require("express").Router();
const TaxServiceCategory = require('../../controllers/tax.service.controller/tax.service.category.controller')
const TaxServicePackage = require('../../controllers/tax.service.controller/tax.service.package.controller')
// const InsuranceOrder = require('../../controllers/insurance.service.controller/insurance.service.order.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

//category
router.post("/category/create", authAdmin, TaxServiceCategory.create);
router.get("/category/list", auth, TaxServiceCategory.GetAll);
router.get("/category/list/:id", auth, TaxServiceCategory.GetById);
router.put("/category/update/:id", authAdmin, TaxServiceCategory.update);
router.delete("/category/delete/:id", authAdmin, TaxServiceCategory.delete);

//package
router.post("/package/create", authAdmin, TaxServicePackage.create);
router.get("/package/list", auth, TaxServicePackage.GetAll);
router.get("/package/list/:id", auth, TaxServicePackage.GetById);
router.get("/package/listbycate/:id", auth, TaxServicePackage.GetByCateId);
router.put("/package/update/:id", authAdmin, TaxServicePackage.update);
router.delete("/package/delete/:id", authAdmin, TaxServicePackage.delete);

//order
// router.post("/order", auth, InsuranceOrder.order)

module.exports = router