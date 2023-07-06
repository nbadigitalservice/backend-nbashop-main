const router = require('express').Router();
const mobile_topup = require('../../controllers/mobile.topup.controller/mobile.topup');
const auth = require("../../lib/auth");

router.post('/verify',auth, mobile_topup.verify);
router.post('/confirm',auth, mobile_topup.confirm);

module.exports = router;