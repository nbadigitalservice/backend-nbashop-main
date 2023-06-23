const router = require('express').Router();
const FunctionMore = require('../../controllers/more.controller/function.more.controller')
const authAdmin = require('../../lib/auth.admin');
const auth = require('../../lib/auth');
router.get('/', authAdmin, FunctionMore.getAll);
router.get('/:id', auth, FunctionMore.getById);
router.get('/function/:func_name',auth, FunctionMore.getByFunctionName);
router.post('/',authAdmin, FunctionMore.create);
router.put('/:id',authAdmin, FunctionMore.update);
module.exports = router;