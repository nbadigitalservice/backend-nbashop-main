const router = require('express').Router();
const RegsimPackage = require('../../controllers/regsim.service.controller/regsim.ais.controller')
const RegsimOrder = require('../../controllers/regsim.service.controller/regsim.ais.order.controller')
const auth = require('../../lib/auth');
const authAdmin = require('../../lib/auth.admin');

router.post('/create', authAdmin, RegsimPackage.create);
router.get('/list', auth, RegsimPackage.GetAll);
router.get('/list/:id', auth, RegsimPackage.GetById);
router.put('/update/:id', authAdmin, RegsimPackage.update);
router.delete('/delete/:id', authAdmin, RegsimPackage.delete);

// order
router.post('/order', auth, RegsimOrder.order);

module.exports = router