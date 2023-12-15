const router = require("express").Router();
const product = require("../../controllers/pos.controller/product.nba.controller");
const createProduct = require("../../controllers/pos.controller/product.nba.controller/create.product.nba.controller");
const updateProduct = require("../../controllers/pos.controller/product.nba.controller/update.product.nba.controller");
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin')

router.post("/", authAdmin, createProduct.create);

router.get("/dealer/:id", auth, product.findByDealerId);
router.get("/",auth, product.findAll);
router.get("/:id", auth, product.findOne);
router.get('/barcode/:barcode', auth, product.getByBarcode);
router.delete("/:id", auth, product.delete);
router.put("/:id", auth, updateProduct.update);
router.get('/by/credit', product.findByCredit);
router.get('/by/consignment', product.findByConsignment);

module.exports = router;
