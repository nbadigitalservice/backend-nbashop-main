const router = require("express").Router();
const MoneyHistory = require("../../controllers/more.controller/money.history.controller");
const auth = require("../../lib/auth");

router.post("/",auth, MoneyHistory.create);
router.get("/", auth, MoneyHistory.getAll);
router.get("/:id", auth, MoneyHistory.getById);
router.get("/shop-id/:shop_id", auth, MoneyHistory.getByShopId);
router.get("/partner-id/:partner_id", auth, MoneyHistory.getByPartnerId);
module.exports = router;