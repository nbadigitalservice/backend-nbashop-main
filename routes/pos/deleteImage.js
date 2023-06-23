const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const { google } = require("googleapis");
const auth = require("../../lib/auth");

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("DELETE IMAGE", req.params.id);
    if (!req.params.id) {
      return res.status(400).send({
        error: true,
        message: "Please provide DELETE IMAGE id",
      });
    } else {
      try {
        const response = await drive.files.delete({
          fileId: req.params.id.toString(),
        });
        console.log(response.data, response.status);
        return res.send({
          error: false,
          message: "ลบรูปภาพเรียบร้อยเเล้ว",
        });
      } catch (error) {
        console.log(error.message);
        return res.send({
          error: false,
          message: "Delete Image Error",
        });
      }
    }
  } catch {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
