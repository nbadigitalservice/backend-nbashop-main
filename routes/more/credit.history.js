const router = require('express').Router();
const credit_history = require('../../controllers/more.controller/credit.history.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin')
router.post('/',auth, credit_history.create);
router.get('/',authAdmin, credit_history.getAll);
router.get('/shop-id/:shop_id',auth, credit_history.getByShopId);
router.get('/:id', auth, credit_history.getById);

module.exports = router;