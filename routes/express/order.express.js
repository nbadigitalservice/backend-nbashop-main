const router = require('express').Router();
const OrderExpress = require('../../controllers/express.controller/order.express.controller');
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth");

router.post("/", auth, OrderExpress.create);
router.put("/:id", auth, OrderExpress.update);
router.post("/purchase_id", auth, OrderExpress.getByPurchaseId);
router.get("/:id", auth, OrderExpress.getById);
router.get("/shop_id/:shop_id", auth, OrderExpress.getByShopId);
router.get("/", authAdmin, OrderExpress.getAllOrder);
module.exports = router;