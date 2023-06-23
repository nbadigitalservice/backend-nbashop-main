const router = require("express").Router();
const product = require("../../controllers/pos.controller/product.request.controller");
const createProduct = require("../../controllers/pos.controller/product.request.controller/create.product.request.controller");
const updateProduct = require("../../controllers/pos.controller/product.request.controller/update.product.request.controller");
const auth = require("../../lib/auth");

router.post("/", auth, createProduct.create);

router.get("/", auth, product.findAll);
router.get("/:id", auth, product.findOne);

router.delete("/:id", auth, product.delete);
router.put("/:id", auth, updateProduct.update);

module.exports = router;