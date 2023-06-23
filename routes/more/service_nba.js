const router = require('express').Router();
const service_nba = require('../../controllers/more.controller/service_nba.controller')
const authAdmin = require('../../lib/auth.admin');

router.post('/', service_nba.create);
router.put('/:id', authAdmin, service_nba.update);
router.delete('/:id', authAdmin, service_nba.delete);
router.get('/:id', authAdmin, service_nba.getById);
router.get('/', authAdmin, service_nba.getAll);

module.exports = router