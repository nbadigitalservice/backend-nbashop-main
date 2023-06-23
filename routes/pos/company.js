const router = require("express").Router();
const company = require("../../controllers/pos.controller/company.controller");



const auth = require("../../lib/auth");

router.post("/", company.create);

router.get("/", auth, company.findAll);
router.get("/:id", auth, company.findOne);

router.delete("/:id", auth, company.delete);
router.put("/:id", auth, company.update);

module.exports = router;
