const router = require('express').Router();
const order_cs = require('../../controllers/cs.controller/cs.order_cs.controller')
const order_sot = require('../../controllers/cs.controller/cs.order_sot.controller')
const authAdmin =require('../../lib/auth.admin');
const auth = require('../../lib/auth');

router.get('/',authAdmin, order_cs.getAll)
router.get('/shop-id/:shop_id', auth, order_cs.getByShopId);
router.get('/:id', auth, order_cs.getById);

router.get('/company/sot/',authAdmin,order_sot.getAll);
router.get('/company/sot/:id', auth, order_sot.getById);
router.get('/company/sot/order-id/:order_id', authAdmin, order_sot.getByOrderId);
module.exports = router