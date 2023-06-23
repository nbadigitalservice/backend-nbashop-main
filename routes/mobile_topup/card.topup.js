const router = require("express").Router();
const topup_card = require("../../controllers/mobile.topup.controller/card.topup.controller");
const auth = require("../../lib/auth");
router.post("/verify", auth, topup_card.verify);
router.post("/confirm", auth, topup_card.confirm);
module.exports = router;
