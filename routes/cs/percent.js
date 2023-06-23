const router = require('express').Router();
const percent = require('../../controllers/cs.controller/cs.percent.controller')
const auth = require("../../lib/auth.admin");

router.post('/', auth, percent.create);
router.get('/sot',auth, percent.getAll);
router.get('/sot/:id',auth, percent.getById);
router.put('/:id',auth, percent.update);

module.exports = router;