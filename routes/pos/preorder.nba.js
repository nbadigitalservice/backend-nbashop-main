const router = require("express").Router();
const ponba = require("../../controllers/pos.controller/preorder.nba.controller");
const separate = require("../../controllers/pos.controller/preorder.nba.separate.controller");

const auth = require("../../lib/auth");

router.get("/shop-id/:id", auth, ponba.findByShopId);

router.post("/separate/", separate.create);
router.get("/separate/", separate.findAll);
router.get("/separate/:id", separate.findOne);
router.delete("/separate/:id", separate.delete);
router.put("/separate/:id", separate.update);

router.post("/", auth, ponba.create);

router.get("/", auth, ponba.findAll);
router.get("/:id", auth, ponba.findOne);

router.delete("/:id", auth, ponba.delete);
router.put("/:id", auth, ponba.update);

module.exports = router;
