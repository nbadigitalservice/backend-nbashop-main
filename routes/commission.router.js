const router = require("express").Router()
const commission = require('../controllers/commission.controller')
const auth = require("../lib/auth")
const authAdmin = require('../lib/auth.admin');

router.get('/totalcommission/:tel', auth, commission.GetCommissionByTel)
router.get('/list', auth, commission.GetAll)
router.get('/list/:tel', auth, commission.GetUnsummedCommissionsByTel)
router.get('/listbyorderid/:id', auth, commission.GetCommissionByOrderId)
router.get('/bonus', authAdmin, commission.GetTotalBonus)
router.get('/allsale', authAdmin, commission.GetTotalAllSale)
router.get('/platformcommission', authAdmin, commission.GetTotalPlatformCommission)
router.get('/totalallsalebytel/:tel', auth, commission.GetTotalAllSaleByTel)
router.get('/happypoint/:tel', auth, commission.GetHappyPointByTel)

module.exports = router