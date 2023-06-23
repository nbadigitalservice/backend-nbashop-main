const router = require("express").Router();
const PercentCourier = require("../../controllers/express.controller/percent.courier.controller")
const authAdmin = require("../../lib/auth.admin");
router.post("/",authAdmin, PercentCourier.create);
router.get("/", authAdmin, PercentCourier.getAll);
router.get("/:id" ,authAdmin, PercentCourier.getById);
router.put("/:id",authAdmin, PercentCourier.update);
router.delete("/:id",authAdmin, PercentCourier.delete);
module.exports = router;