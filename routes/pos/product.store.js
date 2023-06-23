const router = require("express").Router();
const product = require("../../controllers/pos.controller/product.store.controller/")
const auth = require("../../lib/auth");

router.get("/",auth, product.findAll);
router.post('/',auth, product.create);
router.get("/:_id",auth, product.getById);
router.put("/:_id",auth, product.update);
router.delete("/:_id",auth, product.delete);
router.get("/company/:company_id",auth, product.getByCompanyId)

module.exports = router;