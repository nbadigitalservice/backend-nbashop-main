const router = require('express').Router();
const preoder_consignment = require('../../controllers/pos.controller/preorder.consignment.controller')
const auth = require('../../lib/auth')
const authAdmin = require('../../lib/auth.admin')

router.post('/', auth, preoder_consignment.create);
router.get('/', authAdmin, preoder_consignment.getAll);
router.get('/:id',auth, preoder_consignment.getById);
router.put('/:id',authAdmin, preoder_consignment.update);
router.get('/shop/:shop_id',auth, preoder_consignment.getByShopId);
module.exports = router;