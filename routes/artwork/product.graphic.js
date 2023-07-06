const router = require("express").Router();
var ProductGraphicCategory = require("../../controllers/pos.controller/product.graphic.controller/product.graphic.category.controller");
var ProductGraphic= require("../../controllers/pos.controller/product.graphic.controller/product.graphic.controller");
var ProductGraphicPrice = require("../../controllers/pos.controller/product.graphic.controller/product.graphic.price.controller");
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

//category
router.post('/category',authAdmin,ProductGraphicCategory.Create);
router.get('/category',auth,ProductGraphicCategory.GetAll);
router.get('/category/:id',auth,ProductGraphicCategory.GetCategoryById);

//product graphic
router.get('/',auth,ProductGraphic.GetProductGraphic);
router.post('/',authAdmin,ProductGraphic.Create);

//pricelist
router.post('/price',authAdmin,ProductGraphicPrice.Create);
router.get('/price/:id',auth,ProductGraphicPrice.GetPrice);

module.exports = router