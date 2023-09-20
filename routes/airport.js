const router = require('express').Router();
const airport = require('../controllers/airport.controller/airport.controller');

const authAdmin = require('../lib/auth.admin');

//จังหวัด
router.get('/all', airport.getAll);
router.get('/:id', airport.getById);

module.exports = router;