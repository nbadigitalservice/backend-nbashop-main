const router = require('express').Router();
const https = require("https");
const fs = require("fs");
const path = require("path");

const logo = path.resolve(__dirname, "../public/images/logonba.png");
const font_bold = path.resolve(__dirname, "../public/fonts/Kanit-Bold.ttf");
const font_regular = path.resolve(__dirname, "../public/fonts/Kanit-Regular.ttf");
router.get('/logonba', function(req, res){
    res.sendFile(logo)
});
router.get('/font/kanit/bold', function(req,res){
    res.sendFile(font_bold);
})
router.get('/font/kanit/regular', function(req, res){
    res.sendFile(font_regular);
})


module.exports = router;