const router = require('express').Router();
const mobile_bill = require('../../controllers/cs.controller/cs.mobile_bill.controller')
const auth = require("../../lib/auth");

router.post('/check',auth, mobile_bill.check);
router.post('/verify', auth, mobile_bill.verify);
router.post('/confirm', auth, mobile_bill.confirm);
module.exports = router;