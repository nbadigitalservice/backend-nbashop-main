const router = require('express').Router();
const ApiPartner = require('../controllers/apipartner.controller'); 
const Service = require("../controllers/cs.controller/cs.service.controller")

const authAdmin = require('../lib/auth.admin');
const authPartnerApi = require('../lib/auth.apipartner');

router.post('/create-apipartner',authAdmin,ApiPartner.Create);

router.get('/cs/mobile-topup',authPartnerApi,Service.getMobileService);
router.get('/cs/nbaservice',authPartnerApi,Service.getNBAService);
router.get('/cs/mobile-bill',authPartnerApi,Service.getMobileBillService);
router.get('/cs/card-topup',authPartnerApi,Service.getCardService);
router.get('/cs/barcode-service',authPartnerApi,Service.getBarcodeService);
router.get('/cs/lotto-service',authPartnerApi,Service.getLottoService);
router.get('/cs/money-transfer',authPartnerApi,Service.getMoneyTransferService);
router.get('/cs/proserm',authPartnerApi,Service.getProsermService);
router.get('/cs/wallet',authPartnerApi,Service.getWalletService);
router.get('/cs/cash-in',authPartnerApi,Service.getCashInService);
router.get('/cs/key-in-service',authPartnerApi,Service.getKeyInService);

module.exports = router