const router = require('express').Router();
const qrcode = require('../../controllers/topup_wallet.controller/qrcode.gb.controller')
const auth = require('../../lib/auth')
router.post('/gb/verify',auth, qrcode.verify);
router.post('/gb/check',auth, qrcode.check);
module.exports = router;