const router = require("express").Router();
const shop = require("../../controllers/pos.controller/shop.controller");
const createShop = require("../../controllers/pos.controller/shop.controller/create.shop.controller");
const updateShop = require("../../controllers/pos.controller/shop.controller/update.shop.controller");
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin')

router.get("/partner/:id", auth, shop.findByPartner);
router.post("/",authAdmin, createShop.create);

router.get("/", auth, shop.findAll);
router.get("/:id", auth, shop.findOne);

router.delete("/:id", auth, shop.delete);
router.put("/:id",auth, updateShop.update);

module.exports = router;
