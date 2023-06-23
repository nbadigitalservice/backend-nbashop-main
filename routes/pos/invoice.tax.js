const router = require("express").Router();
const invoiceShopShort = require("../../controllers/pos.controller/invoice.tax.controller/invoice.tax.shop.short");
const invoiceShopFull = require("../../controllers/pos.controller/invoice.tax.controller/invoice.tax.shop.full");
const invoicePreOrderNBA = require("../../controllers/pos.controller/invoice.tax.controller/invoice.tax.po.nba");
const invoiceReturnProduct = require("../../controllers/pos.controller/invoice.tax.controller/invoice.tax.return.product");
const invoiceShopNumber = require("../../controllers/pos.controller/invoice.tax.controller/invoice.shop.number");
const auth = require("../../lib/auth");

router.post("/shop/number",auth, invoiceShopNumber.create);
router.post("/shop/short", auth, invoiceShopShort.create);
router.post("/shop/full", auth, invoiceShopFull.create);
router.post("/nba/preorder", auth, invoicePreOrderNBA.create);
router.post("/return/product", auth, invoiceReturnProduct.create);

// router.get("/", auth, invoice.findAll);
// router.get("/:id", auth, invoice.findOne);

// router.delete("/:id", auth, invoice.delete);
// router.put("/:id", auth, updateinvoice.update);

module.exports = router;
