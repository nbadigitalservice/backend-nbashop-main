const router = require("express").Router();
var ProductGraphicCategory = require("../../controllers/pos.controller/product.graphic.controller/product.graphic.category.controller");
var ProductGraphic= require("../../controllers/pos.controller/product.graphic.controller/product.graphic.controller");
var ProductGraphicPrice = require("../../controllers/pos.controller/product.graphic.controller/product.graphic.price.controller");
var ProductGraphicOrder = require('../../controllers/pos.controller/product.graphic.controller/product.graphic.order.controller');
const graphicorder = require('../../controllers/pos.controller/product.graphic.controller/graphic.order.controller')
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
router.put('/:id',authAdmin,ProductGraphic.UpdateProductGraphicById);
router.delete('/:id',authAdmin,ProductGraphic.DeleteProductGraphicById);
router.put('/:id/change-image',authAdmin,ProductGraphic.ChangeProductGraphicImage);
router.get('/product/category/:id',auth,ProductGraphic.GetPricelistByCategoryId);

//pricelist
router.get('/price/all',authAdmin, ProductGraphicPrice.getAllPriceList);
router.get('/price/byid/:id',auth,ProductGraphicPrice.GetPriceById);
router.post('/price',authAdmin,ProductGraphicPrice.Create);
router.get('/price/:id',auth,ProductGraphicPrice.GetPrice);
router.put('/price/:id',auth,ProductGraphicPrice.updatePriceList);
router.delete('/price/:id',auth,ProductGraphicPrice.DeleteProductGraphicPriceList);

//preorder
// router.post('/preorder',authAdmin,ProductGraphicOrder.PreOrderProductGraphic);
router.post('/order', auth, graphicorder.order);


module.exports = router