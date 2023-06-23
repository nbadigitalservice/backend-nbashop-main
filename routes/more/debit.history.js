const router = require("express").Router();
const debit_history = require("../../controllers/more.controller/debit.history.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");

router.post('/',auth, debit_history.create);
router.get('/:id', auth, debit_history.getById);
router.get('/shop/:shop_id', auth, debit_history.getByShopId);

module.exports = router;
