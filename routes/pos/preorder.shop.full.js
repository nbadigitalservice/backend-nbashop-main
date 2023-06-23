const router = require("express").Router();
const poshopf = require("../../controllers/pos.controller/preorder.shop.full.controller");

const auth = require("../../lib/auth");

router.get("/shop-id/:id",auth, poshopf.findByShopId);

router.post("/", auth, poshopf.create);

router.get("/", auth, poshopf.findAll);
router.get("/:id", auth, poshopf.findOne);

router.delete("/:id", auth, poshopf.delete);
router.put("/:id", auth, poshopf.update);

module.exports = router;
