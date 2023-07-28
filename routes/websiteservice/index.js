const router = require("express").Router();
const WebsiteService = require('../../controllers/website.service.controller/website.service.controller')
const auth = require("../../lib/auth");
const authAdmin = require('../../lib/auth.admin');

router.post("/create", authAdmin, WebsiteService.create);
router.get("/list", auth, WebsiteService.GetAll);
router.get("/list/:id", auth, WebsiteService.GetById);
router.put("/update/:id", authAdmin, WebsiteService.update);
router.delete("/delete/:id", authAdmin, WebsiteService.delete);

module.exports = router