const router = require("express").Router();
const invoice = require("../../controllers/pos.controller/invoice.shop.controller");
const createinvoice = require("../../controllers/pos.controller/invoice.shop.controller/create.invoice.shop.controller");
const updateinvoice = require("../../controllers/pos.controller/invoice.shop.controller/update.invoice.shop.controller");
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin')

router.post("/", auth, createinvoice.create);

router.get("/", authAdmin, invoice.findAll);
router.get("/:id", auth, invoice.findOne);
router.get("/shop-id/:shop_id", invoice.getByShopId)
router.delete("/:id", authAdmin, invoice.delete);
router.put("/:id", auth, updateinvoice.update);

module.exports = router;
