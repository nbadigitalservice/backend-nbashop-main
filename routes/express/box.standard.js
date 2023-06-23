const router = require("express").Router();
const BoxStandard = require("../../controllers/express.controller/box.standard.controller")
const authAdmin = require("../../lib/auth.admin")
const auth = require("../../lib/auth");

router.post("/",auth, BoxStandard.create);
router.put("/:id",authAdmin, BoxStandard.update);
router.delete("/:id",authAdmin, BoxStandard.delete);
router.get("/",auth, BoxStandard.getAll);
router.get("/:id",auth, BoxStandard.getById);

module.exports = router;