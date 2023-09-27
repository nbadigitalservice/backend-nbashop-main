require("dotenv").config();
const axios = require("axios");

module.exports = checkToken = async (req, res) => {
  const Token = await axios
    .post(process.env.AOC_URL + "Token", {
      grantType: "password",
      username: process.env.AOC_USERNAME,
      password: process.env.AOC_PASSWORD,
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send({message: err});
    });
  const token = Token.data.accessToken;
};
