const router = require("express").Router();
const platform = require("../../controllers/more.controller/platform.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");

router.get("/member/list", auth, platform.getMemberAll);
router.get("/member/:tel", auth, platform.getByTel);
router.post("/givecommission", authAdmin, platform.giveCommission);
router.post("/givehappypoint", authAdmin, platform.giveHappyPoint);

module.exports = router;
