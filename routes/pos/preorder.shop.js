const router = require("express").Router();
const poshop = require("../../controllers/pos.controller/preorder.shop.controller");

const auth = require("../../lib/auth");

router.get("/shop-id/:id",auth, poshop.findByShopId);

router.post("/", auth, poshop.create);

router.get("/", auth, poshop.findAll);
router.get("/:id", auth, poshop.findOne);

router.delete("/:id", auth, poshop.delete);
router.put("/:id", auth, poshop.update);

module.exports = router;
