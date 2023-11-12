require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = checkToken = async (req, res, next) => {
  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2JmYjFhMzMyMzljMjUxMzRlNTU2YWEiLCJyb3ciOiJhZG1pbiIsImlhdCI6MTY5OTc2OTk0MywiZXhwIjoxNjk5Nzg0MzQzfQ.tD7DXqy51bkmP03aFTWQy90yED8MWaAqrUOsUyfWUcY";
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
