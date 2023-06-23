const router = require('express').Router();
const mobile_topup = require('../../controllers/mobile.topup.controller/index');

router.post('/verify', mobile_topup.verify);
router.post('/confirm', mobile_topup.confirm);

module.exports = router;