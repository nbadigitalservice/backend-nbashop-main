const axios = require("axios");

async function TicketToken() {
  try {
    let data;
    const packageData = {
      username: process.env.AOC_USERNAME,
      password: process.env.AOC_PASSWORD,
      grantType: "password",
    };
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
      },
      url: process.env.AOC_URL,
      data: packageData,
    };
    await axios(config)
      .then((response) => {
        if (response) {
          data = response.data;
        }
      })
      .catch((error) => {
        data = error;
      });
  } catch (err) {
    console.log(err);
  }
}

async function TicketFlight(message, token) {
  console.log("message", message);
  try {
    await axios
      .post(
        process.env.AOC_URL,
        {
          message: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("--ค้นหาเที่ยวบิน สำเร็จ --");
      })
      .catch((err) => {
        console.log(err);
        console.log("--ค้นหาเที่ยวบิน ไม่สำเร็จ--");
      });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {TicketFlight, TicketToken};
