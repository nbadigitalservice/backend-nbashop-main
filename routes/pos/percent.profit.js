const router = require("express").Router();
const Percent = require("../../controllers/pos.controller/percent.profit.controller");

const auth = require("../../lib/auth.admin");


router.post("/",auth,  Percent.create);
router.get("/",auth, Percent.findAll);
router.get("/:id", auth, Percent.findOne);
router.delete("/:id", auth, Percent.delete);
router.put("/:id", auth, Percent.update);

module.exports = router;
