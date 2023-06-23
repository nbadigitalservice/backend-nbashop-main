const router = require('express').Router();
const province = require('../controllers/thailand.controller/province.controller');
const amphure = require('../controllers/thailand.controller/amphure.controller')
const tambon = require('../controllers/thailand.controller/tambon.controller')
const authAdmin = require('../lib/auth.admin');

//จังหวัด
router.get('/province', province.getAll);
router.get('/province/:id', province.getById);

//อำเภอ
router.get('/amphure', amphure.getAll);
router.get('/amphure/:id', amphure.getById);
router.get('/amphure/by-province-id/:province_id',amphure.getByProvinceId);

//ตำบล
router.get('/tambon', tambon.getAll);
router.get('/tambon/:id', tambon.getById);
router.get('/tambon/by-amphure-id/:amphure_id', tambon.getByAmphureId);
router.post('/tambon', authAdmin, tambon.addTambon);
router.delete('/tambon/:id',authAdmin, tambon.delTambon);
router.put('/tambon/:id',authAdmin, tambon.updateTambon);

module.exports = router;