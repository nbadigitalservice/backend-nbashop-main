const router = require("express").Router();
const admins = require("../../controllers/pos.controller/admin.controller");
const authAdmin = require("../../lib/auth.admin");

router.post("/", authAdmin, admins.create);

router.get("/", authAdmin, admins.findAll);
router.get("/:id", authAdmin, admins.findOne);

router.delete("/:id", authAdmin, admins.delete);
router.put("/:id", authAdmin, admins.update);

module.exports = router;
