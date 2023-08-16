const router = require("express").Router()
const exchangepointCRUD = require('../../controllers/exchangepoint.controller/exchangepoint.controller')
const exchange = require('../../controllers/exchangepoint.controller/exchangepoint.exchange.controller')
const auth = require("../../lib/auth")
const authAdmin = require('../../lib/auth.admin');

// CRUD
router.post('/create', authAdmin, exchangepointCRUD.create)
router.get('/list/', auth, exchangepointCRUD.GetAll)
router.get('/list/:id', auth, exchangepointCRUD.GetById)
router.put('/update/:id', authAdmin, exchangepointCRUD.update)
router.delete('/delete/:id', authAdmin, exchangepointCRUD.delete)

// exchange
router.post('/exchange', auth, exchange.exchange)

module.exports = router