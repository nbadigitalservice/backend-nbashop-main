const router = require('express').Router();
const barcode = require('../../controllers/cs.controller/cs.barcode.controller')
const auth = require("../../lib/auth");
router.post('/check', auth, barcode.check);
router.post('/verify', auth, barcode.verify);
router.post('/confirm', auth, barcode.confirm);
module.exports = router;