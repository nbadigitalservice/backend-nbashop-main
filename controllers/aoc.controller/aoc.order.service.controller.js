const axios = require("axios");

//get Profile
exports.getAocService = async (req, res) => {
  try {
    const service = await axios
      .post(process.env.AOC_URL + "FlightSearchMultiTicket", {
        tripType: req.body.tripType,
        originCode: req.body.originCode,
        destinationCode: req.body.destinationCode,
        svcClass: req.body.svcClass,
        directFlight: req.body.directFlight,
        departDate: req.body.departDate,
        returnDate: req.body.returnDate,
        adult: req.body.adult,
        child: req.body.child,
        infant: req.body.infant,
        languageCode: req.body.languageCode,
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({message: err});
      });
    if (service) {
      return res.status(200).send({data: service});
    }
    // const
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};
