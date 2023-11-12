const router = require("express").Router();
const Category = require("../../controllers/antiques_categories.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");



router.get("/get", auth, Category.Getcategory);
router.post("/CreateCategory", auth, Category.CreateCategory);
router.post("/CreateCategoryType", auth, Category.CreateCategoryType);
router.post("/createcategory", auth, Category.CreateCategory);
router.post("/createtype", auth, Category.CreateType);
module.exports = router;