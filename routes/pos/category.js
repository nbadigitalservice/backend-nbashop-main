const router = require('express').Router();
const category = require('../../controllers/pos.controller/product.nba.controller/category.controller')
const auth = require('../../lib/auth');
const authAdmin = require('../../lib/auth.admin');

router.post('/', authAdmin,  category.create);
router.get('/', auth, category.getAll);
router.get('/:id', authAdmin, category.getById);
router.put('/:id',authAdmin, category.update);
router.delete('/:id',authAdmin, category.delete);

module.exports = router;