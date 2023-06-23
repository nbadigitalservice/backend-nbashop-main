const router = require('express').Router();
const auth = require('../../lib/auth');
const order_nba = require('../../controllers/cs.controller/cs.nba.controller');
const authAdmin = require('../../lib/auth.admin');

router.post('/',auth, order_nba.create);
router.get('/order', auth, order_nba.getAll);
router.get('/order/:id',authAdmin, order_nba.getById);
router.get('/order/order-id/:orderid',authAdmin, order_nba.getByOrderId);
router.get('/order/invoice/:invoice',authAdmin, order_nba.getByInvoice);
router.put('/order/:id',authAdmin,order_nba.update);

module.exports = router