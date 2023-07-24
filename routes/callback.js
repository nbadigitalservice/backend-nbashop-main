const router = require('express').Router();
const gb_pay = require('../controllers/topup_wallet.controller/qrcode.gb.controller');
const poshop = require('../controllers/pos.controller/preorder.shop.controller/index');
const percent = require('../controllers/pos.controller/percent.profit.controller');
const authAdmin = require('../lib/auth.admin');
const LineCallback = require('../controllers/callback/line.notify.callback.controller');


router.post('/gbpay', gb_pay.callback);
router.post('/shopcutoff', poshop.cutoff);
router.post('/vat/update',authAdmin, percent.vatUpdate);
router.post('/share/update',authAdmin, percent.updateShare);
router.post('/line',LineCallback.Received)
module.exports = router;