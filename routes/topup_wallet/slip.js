const router = require('express').Router();
const slip = require('../../controllers/topup_wallet.controller/slip.controller')
const auth = require('../../lib/auth')
const authAdmin = require('../../lib/auth.admin')

router.post('/',auth, slip.create);
router.put('/:id',authAdmin, slip.update);
module.exports = router;