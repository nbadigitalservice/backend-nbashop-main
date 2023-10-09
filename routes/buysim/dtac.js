const router = require('express').Router();
const BuysimPackage = require('../../controllers/buysim.controller/buysim.dtac.controller')
const BuysimOrder = require('../../controllers/buysim.controller/buysim.dtac.order.controller')
const auth = require('../../lib/auth');
const authAdmin = require('../../lib/auth.admin');

router.post('/create', authAdmin, BuysimPackage.create);
router.get('/list', auth, BuysimPackage.GetAll);
router.get('/list/:id', auth, BuysimPackage.GetById);
router.put('/update/:id', authAdmin, BuysimPackage.update);
router.delete('/delete/:id', authAdmin, BuysimPackage.delete);

// order
router.post('/order', auth, BuysimOrder.order);

module.exports = router