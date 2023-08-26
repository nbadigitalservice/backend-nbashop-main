const router = require("express").Router()
const wallethistory = require('../controllers/wallet.history')
const auth = require("../lib/auth")
const authAdmin = require('../lib/auth.admin');

router.get('/list', authAdmin, wallethistory.GetAll)
router.get('/listbypid/:id', auth, wallethistory.GetWalletHistoryByPartnerId)

module.exports = router