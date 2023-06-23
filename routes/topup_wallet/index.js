const router = require('express').Router();
const topup_wallet = require('../../controllers/topup_wallet.controller/index')
const auth = require('../../lib/auth');
const authAdmin = require('../../lib/auth.admin')

router.get('/all',authAdmin, topup_wallet.getAll)
router.get('/partner-id/:partner_id',auth, topup_wallet.getByPartnerId);
router.get('/:id',auth, topup_wallet.getById)
module.exports = router;