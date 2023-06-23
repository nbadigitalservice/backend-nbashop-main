const router = require("express").Router();
const Advertising = require("../../controllers/pos.controller/advertising.image.controller");

const auth = require("../../lib/auth");

router.post("/", auth, Advertising.create);

router.get("/", Advertising.findAll);
router.get("/:id", Advertising.findOne);

router.delete("/:id", auth, Advertising.delete);
router.put("/:id", auth, Advertising.update);

module.exports = router;
