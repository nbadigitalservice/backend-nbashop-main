const router = require('express').Router();
const auth = require('../../lib/auth');
const authAdmin = require('../../lib/auth.admin');
const order_consignment = require('../../controllers/pos.controller/order.consignment.controller')

router.post('/', authAdmin, order_consignment.create);
router.get('/',authAdmin, order_consignment.getAll);
router.get('/:id',auth, order_consignment.getById);
router.get('/shop/:shop_id',auth, order_consignment.getByShopId);
router.get('/dealer/:dealer_id',auth, order_consignment.getByDealerId);
router.get('/pocon/:pocon_id',auth, order_consignment.getByPreorderConsignmentId);
router.put('/:id',auth, order_consignment.update);
module.exports = router;