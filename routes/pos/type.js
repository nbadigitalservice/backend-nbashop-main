const router = require("express").Router();
const type = require("../../controllers/pos.controller/type.controller");

const auth = require("../../lib/auth");

router.post("/", auth, type.create);

router.get("/", auth, type.findAll);
router.get("/:id", auth, type.findOne);

router.delete("/:id", auth, type.delete);
router.put("/:id", auth, type.update);

module.exports = router;

