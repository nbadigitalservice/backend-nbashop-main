const {ApiAirport} = require("../../models/airport/airport.model");
const axios = require("axios");

//get Token
exports.token = async (req, res) => {
  try {
    console.log("--Get Token--");
    const token = await axios
      .post(
        process.env.AOC_URL + "Token",
        {
          grantType: "password",
          username: process.env.AOC_USERNAME,
          password: process.env.AOC_PASSWORD,
        },
      )
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (token) {
      return res.status(200).send({data: token.data});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

//get search
exports.search = async (req, res) => {
    try {
      console.log("--Get Token--");
      const token = await axios
        .post(
          process.env.AOC_URL + "FlightSearchMultiTicket",
          {
            grantType: "password",
            username: process.env.AOC_USERNAME,
            password: process.env.AOC_PASSWORD,
          },
        )
        .catch((err) => {
          console.log(err);
          return res.status(400).send({message: err});
        });
      if (token) {
        return res.status(200).send({data: token.data});
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
    }
  };
