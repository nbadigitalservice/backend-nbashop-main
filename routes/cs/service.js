const router = require('express').Router();
const service = require("../../controllers/cs.controller/cs.service.controller")
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin')

router.get('/all',auth, service.getAllService);
router.get('/profile',authAdmin, service.profile);
router.get('/mobile',auth, service.getMobileService);
router.get('/mobile_bill',auth, service.getMobileBillService);
router.get('/card',auth, service.getCardService);
router.get('/barcode',auth, service.getBarcodeService);
router.get('/lotto',auth, service.getLottoService);
router.get('/moneytransfer',auth, service.getMoneyTransferService);
router.get('/proserm',auth, service.getProsermService);
router.get('/wallet',auth, service.getWalletService);
router.get('/cashin',auth, service.getCashInService);
router.get('/keyin',auth, service.getKeyInService);
router.get('/nba', service.getNBAService);
router.post('/sot/callback', service.callback);

module.exports = router