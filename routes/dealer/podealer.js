const router = require('express').Router();
const podealer = require('../../controllers/dealer.controller/podealer.controller')
const auth = require('../../lib/auth');
const authAdmin = require('../../lib/auth.admin');

router.post('/', authAdmin, podealer.create);
router.put('/:id',authAdmin, podealer.update);
router.get('/:id',auth, podealer.getById);
router.get('/',authAdmin, podealer.getAll);
router.get('/id/:dealer_id',auth, podealer.getByDealerId);
router.get('/invoice/:invoice',auth, podealer.getByInvoice);

module.exports = router;