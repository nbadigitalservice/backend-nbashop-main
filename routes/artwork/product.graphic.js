const router = require("express").Router();
var ProductGraphicCategory = require("../../controllers/pos.controller/product.graphic.controller/product.graphic.category.controller");
var ProductGraphic= require("../../controllers/pos.controller/product.graphic.controller/product.graphic.controller");
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

//category
router.post('/category',authAdmin,ProductGraphicCategory.Create);

//product graphic
router.get('/',auth,ProductGraphic.GetProductGraphic);
router.post('/',authAdmin,ProductGraphic.Create);

module.exports = router