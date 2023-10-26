const axios = require("axios");

//get Token
exports.getToken = async (req, res) => {
  try {
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
    const token = Token.data;
    if (token) {
      return res.status(200).send({data: token});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

//get ticket
exports.getFlightTicket = async (req, res) => {
  try {
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

    const {
      tripType,
      originCode,
      destinationCode,
      airline,
      svcClass,
      directFlight,
      departDate,
      returnDate,
      adult,
      child,
      infant,
      languageCode,
    } = req.body;

    const data = await axios
      .post(
        process.env.AOC_URL + "FlightSearchMultiTicket",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Cookie:
              "ARRAffinity=6d3572b2b5d6d73206c9c4a99a5ad142df9de7ce275826b9ad09831ef137d7de; ARRAffinitySameSite=6d3572b2b5d6d73206c9c4a99a5ad142df9de7ce275826b9ad09831ef137d7de",
          },
        },
        {
          tripType: tripType,
          originCode: originCode,
          destinationCode: destinationCode,
          airline: airline,
          svcClass: svcClass,
          directFlight: directFlight,
          departDate: departDate,
          returnDate: returnDate,
          adult: adult,
          child: child,
          infant: infant,
          languageCode: languageCode,
        }
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
      });
    console.log(data.data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};
