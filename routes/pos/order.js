const router = require("express").Router();
const order = require("../../controllers/pos.controller/order.controller");
const auth = require("../../lib/auth");

router.post("/", auth, order.create);
router.get("/", auth, order.findAll);
router.get("/:id", auth, order.findById);
router.put("/:id", auth, order.update);
router.get("/shop-id/:shop_id", auth, order.findByShopId);
router.get("/dealer-id/:dealer_id", auth, order.findByDealerId);
router.get("/store-id/:store_id", auth, order.findByStoreId);
router.get('/ponba/:ponba_id', auth, order.findByPoNbaId);
module.exports = router;