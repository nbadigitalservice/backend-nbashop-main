const router = require("express").Router();
var express = require("express");
var request = require("request");

router.post("/", async (req, res) => {
  try {
    var token = req.body.token;
    var message = req.body.message;
    request(
      {
        method: "POST",
        uri: "https://notify-api.line.me/api/notify/",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          bearer: token,
        },
        form: {
          message: message,
        },
      },
      (err, httpResponse, body) => {
        if (err) {
          console.log(err);
        } else {
          res.json({
            httpResponse: httpResponse,
            body: body,
          });
        }
      }
    );
  } catch (error) {
    res.status(401).send({ message: "ไม่สามารถทำรายการนี้ได้", status: false });
  }
});

module.exports = router;
