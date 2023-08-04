const router = require("express").Router();
const AccountServiceCategory = require('../../controllers/account.service.controller/account.service.category.controller')
const AccountServicePackage = require('../../controllers/account.service.controller/account.service.package.controller')
const AccountOrder = require('../../controllers/account.service.controller/account.service.order.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

//category
router.post("/category/create", authAdmin, AccountServiceCategory.create);
router.get("/category/list", auth, AccountServiceCategory.GetAll);
router.get("/category/list/:id", auth, AccountServiceCategory.GetById);
router.put("/category/update/:id", authAdmin, AccountServiceCategory.update);
router.delete("/category/delete/:id", authAdmin, AccountServiceCategory.delete);

//package
router.post("/package/create", authAdmin, AccountServicePackage.create);
router.get("/package/list", auth, AccountServicePackage.GetAll);
router.get("/package/list/:id", auth, AccountServicePackage.GetById);
router.get("/package/listbycate/:id", auth, AccountServicePackage.GetByCateId);
router.put("/package/update/:id", authAdmin, AccountServicePackage.update);
router.delete("/package/delete/:id", authAdmin, AccountServicePackage.delete);

//order
router.post("/order", auth, AccountOrder.order)

module.exports = router