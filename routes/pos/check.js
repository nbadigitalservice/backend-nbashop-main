const router = require("express").Router();
const barcodeShop = require("../../controllers/pos.controller/check.controller/check.barcode.shop");
const barcodeNBA = require("../../controllers/pos.controller/check.controller/check.barcode.nba");

const auth = require("../../lib/auth");

router.post("/barcode/shop", auth, barcodeShop.create);
router.post("/barcode/nba", auth, barcodeNBA.create);

module.exports = router;
