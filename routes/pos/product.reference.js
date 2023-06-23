const router = require("express").Router();
const productReference = require("../../controllers/pos.controller/product.reference.controller");

const auth = require("../../lib/auth");

router.get("/shop-id/:id", auth, productReference.findByShopId);

router.post("/", auth, productReference.create);
router.get("/", auth, productReference.findAll);
router.get("/:id", auth, productReference.findOne);
router.delete("/:id", auth, productReference.delete);
router.put("/:id", auth, productReference.update);

module.exports = router;
