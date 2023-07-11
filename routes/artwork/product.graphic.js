const router = require("express").Router();
var ProductGraphicCategory = require("../../controllers/pos.controller/product.graphic.controller/product.graphic.category.controller");
var ProductGraphic= require("../../controllers/pos.controller/product.graphic.controller/product.graphic.controller");
var ProductGraphicPrice = require("../../controllers/pos.controller/product.graphic.controller/product.graphic.price.controller");
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

//category
router.post('/category',authAdmin,ProductGraphicCategory.Create);
router.get('/category',auth,ProductGraphicCategory.GetAll);
router.put('/category/:id',auth,ProductGraphicCategory.Update);
router.get('/category/:id',auth,ProductGraphicCategory.GetCategoryById);
router.delete('/category/:id',auth,ProductGraphicCategory.deleteCategory);

//product graphic
router.get('/',auth,ProductGraphic.GetProductGraphic);
router.get('/:id',auth,ProductGraphic.GetProductGraphicById);
router.post('/',authAdmin,ProductGraphic.Create);
router.put('/:id',auth,ProductGraphic.UpdateProductGraphicById);
router.delete('/:id',auth,ProductGraphic.DeleteProductGraphicById)

//pricelist
router.post('/price',authAdmin,ProductGraphicPrice.Create);
router.get('/price/:id',auth,ProductGraphicPrice.GetPrice);
router.put('/price/:id',auth,ProductGraphicPrice.updatePriceList);
router.delete('/price/:id',auth,ProductGraphicPrice.DeleteProductGraphicPriceList);

module.exports = router