const router = require("express").Router()
const commission = require('../controllers/commission.controller')
const auth = require("../lib/auth")
const authAdmin = require('../lib/auth.admin');

router.get('/totalcommission', auth, commission.GetCommissionByTel)
router.get('/list', auth, commission.GetAll)
router.get('/listcommission', auth, commission.GetUnsummedCommissionsByTel)
router.get('/listbyorderid/:id', auth, commission.GetCommissionByOrderId)
router.get('/bonus', authAdmin, commission.GetTotalBonus)
router.get('/allsale', authAdmin, commission.GetTotalAllSale)
router.get('/platformcommission', authAdmin, commission.GetTotalPlatformCommission)
router.get('/totalallsalebytel', auth, commission.GetTotalAllSaleByTel)
router.get('/happypoint/:tel', auth, commission.GetHappyPointByTel)

//delete
router.delete('/delete/:id',authAdmin, commission.DeleteCommission)

module.exports = router