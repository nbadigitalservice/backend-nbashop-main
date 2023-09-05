const router = require("express").Router();
const TaxServiceCategory = require('../../controllers/tax.service.controller/tax.service.category.controller')
const TaxServicePackage = require('../../controllers/tax.service.controller/tax.service.package.controller')
const TaxOrder = require('../../controllers/tax.service.controller/tax.service.order.controller')
const TaxReverse = require('../../controllers/tax.service.controller/taxreverse.controller')
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
router.post("/order", auth, TaxOrder.order)
router.put("/order/updatepicture/:id", auth, TaxOrder.updatePictures)
router.post("/order/confirm/:id", authAdmin, TaxOrder.confirm)
router.post("/order/cusconfirm/:id", auth, TaxOrder.ConfirmByCustomer)

// tax reverse
router.get("/taxreverse/list/:id", auth, TaxReverse.GetByOrderId)
router.get("/taxreverse/list", auth, TaxReverse.GetByShopId)

// cancel by customer
router.put("/taxreverse/cancel/:id", auth, TaxOrder.CancelByCustomer)

module.exports = router