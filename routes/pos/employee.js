const router = require("express").Router();
const employee = require("../../controllers/pos.controller/employee.controller");
const auth = require("../../lib/auth");

router.get("/shop/:id", auth, employee.findByShopId);

router.post("/", auth, employee.create);

router.get("/", auth, employee.findAll);
router.get("/:id", auth, employee.findOne);

router.delete("/:id", auth, employee.delete);
router.put("/:id", auth, employee.update);

module.exports = router;
