const router = require("express").Router();
const dealer = require("../../controllers/pos.controller/dealer.controller");
const dealerCreact = require("../../controllers/pos.controller/dealer.controller/create.dealer.controller");
const dealerUpdate = require("../../controllers/pos.controller/dealer.controller/update.dealer.controller");

const dealerRequest = require("../../controllers/pos.controller/dealer.request.controller");
const dealerCreactRequest = require("../../controllers/pos.controller/dealer.request.controller/create.dealer.request.controller");
const dealerUpdateRequest = require("../../controllers/pos.controller/dealer.request.controller/update.dealer.request.controller");
const dealerResponse = require("../../controllers/pos.controller/dealer.controller/dealer.response.controller")
const auth = require("../../lib/auth");

const payment_dealer = require('../../controllers/dealer.controller/payment.controller')
const authAdmin = require('../../lib/auth.admin');


router.get("/request/dealer/:id", auth, dealerRequest.findByDealerId);
router.post("/request/", auth, dealerCreactRequest.create);
router.get("/request/", auth, dealerRequest.findAll);
router.get("/request/:id", auth, dealerRequest.findOne);
router.delete("/request/:id", auth, dealerRequest.delete);
router.put("/request/:id", auth, dealerUpdateRequest.update);
// __________________________________________________________

router.get("/check-phone/:id", dealer.findCheckPhone);
router.post("/", dealerCreact.create);
router.get("/", auth, dealer.findAll);
router.get("/:id", auth, dealer.findOne);
router.delete("/:id", auth, dealer.delete);
router.put("/:id", auth, dealerUpdate.update);

//-------------------------------------------------//
router.post("/response", auth, dealerResponse.create);
router.put("/response/:id", auth, dealerResponse.update);
router.delete("/response/:id", auth, dealerResponse.delete);
router.get("/response/all", auth, dealerResponse.findAll);
router.get("/response/:id", auth, dealerResponse.findById);
router.get("/response/dealer/:id", auth, dealerResponse.findByDealerId)

//---------------------PAYMENT -------------------------//
router.post('/payment',authAdmin, payment_dealer.create);
router.get('/payment',authAdmin, payment_dealer.getAll);
router.get('/payment/:id',auth, payment_dealer.getByDealerId);
router.get('/payment/id/:dealer_id',auth, payment_dealer.getByDealerId)
router.put('/payment/:id',authAdmin, payment_dealer.update);

module.exports = router;
