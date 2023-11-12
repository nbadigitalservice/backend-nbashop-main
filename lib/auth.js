require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = checkToken = async (req, res, next) => {
  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGYxOGUxOGJmY2E0NTkyYzYyYTcyYWQiLCJuYW1lIjoi4LiZ4LmJ4Lit4LiH4Lij4Liy4LihIiwic2hvcF9pZCI6IjY0ZWRhYTkxYTcwZDJlZDI5YThiMmJkOSIsInBob25lIjoiMDkwLTk1MDA3MDkiLCJyb3ciOiJlbXBsb3llZSIsImlhdCI6MTY5OTc1NDc0MCwiZXhwIjoxNjk5NzY5MTQwfQ.D_r7uwSC-0PR84y9cwAJ5j3qmDVRUMhBCg7yNXWe7Ws";
  // let token = req.rawHeaders["auth-token"];
  // console.log(req.rawHeaders);
  if (token!==undefined) {
    token = token.replace(/^Bearer\s+/, "");
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
      if (err) {
        return res.status(408).json({
          success: false,
          message: "หมดเวลาใช้งานแล้ว",
          logout: true,
          description: "Request Timeout",
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Token not provided Token ไม่ถูกต้อง", token,
      logout: false,
      description: "Unauthorized",
    });
  }
};
