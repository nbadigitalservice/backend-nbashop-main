const router = require('express').Router();
const wallet = require('../../controllers/cs.controller/cs.wallet.controller')
const auth = require("../../lib/auth");
router.post('/verify',auth,wallet.verify);
router.post('/confirm',auth,wallet.confirm);
module.exports = router;