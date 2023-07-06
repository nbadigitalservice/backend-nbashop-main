const router = require('express').Router();
const mobile_topup = require('../../controllers/mobile.topup.controller/mobile.topup.collection.controller')
const authAdmin = require('../../lib/auth.admin')
const auth = require('../../lib/auth');

router.get('/',authAdmin, mobile_topup.getAll);
router.get('/:id',auth, mobile_topup.getById);
router.get('/shop-id/:shop_id',auth, mobile_topup.getByShopId);
module.exports = router;