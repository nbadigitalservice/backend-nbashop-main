const router = require("express").Router();
const product = require("../../controllers/pos.controller/product.shop.controller");
const createProduct = require("../../controllers/pos.controller/product.shop.controller/create.product.shop.controller");
const updateProduct = require("../../controllers/pos.controller/product.shop.controller/update.product.shop.controller");
const changeStock = require('../../controllers/pos.controller/product.shop.controller/change.stock.shop.controller')
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");

router.get("/shop-id/:id",auth, product.findByShopId);
router.get("/barcode/:shop_id/:barcode", authAdmin, product.getByBarcode)
router.post("/", auth, createProduct.create);
router.post('/change-stock', auth, changeStock.createChangeStock);
router.get("/", auth, product.findAll);
router.get("/:id", auth, product.findOne);

router.delete("/:id", auth, product.delete);
router.put("/:id", auth, updateProduct.update);

module.exports = router;
