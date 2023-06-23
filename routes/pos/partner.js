const router = require("express").Router();
const partner = require("../../controllers/pos.controller/partner.controller");
const auth = require("../../lib/auth");

router.post("/", auth, partner.create);

router.get("/", auth, partner.findAll);
router.get("/:id", auth, partner.findOne);

router.delete("/:id", auth, partner.delete);
router.put("/:id", auth, partner.update);

module.exports = router;
