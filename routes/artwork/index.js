const router = require("express").Router();
const artwork = require("../../controllers/artwork.controller/artwork.list.controller");
const poartwork = require("../../controllers/artwork.controller/preorder.artwork.controller")
const order_artwork = require('../../controllers/artwork.controller/order.artwork.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/list",authAdmin, artwork.create);
router.get("/list",auth, artwork.findAll);
router.put("/list/:id",authAdmin, artwork.update);
router.delete("/list/:id",authAdmin, artwork.delete);

router.get("/preorder", authAdmin, poartwork.getAll);
router.get("/preorder/:id", auth, poartwork.getById);
router.get("/preorder/shop-id/:shop_id", auth, poartwork.findByShopId);
router.put("/preorder/:id", authAdmin, poartwork.update);
router.delete("/preorder/:id", auth, poartwork.delete);

//ขั้นต่อการสั่ง
router.post('/check',auth, order_artwork.check);
router.post('/confirm', auth, order_artwork.confirm);
module.exports = router
