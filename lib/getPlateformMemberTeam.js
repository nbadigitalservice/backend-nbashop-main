const axios = require("axios");

async function GetTeamMember(tel) {
  try {
    const request = {
      method: "get",
      headers: {
        token: process.env.NBA_PLATFORM_SECRET_KEY,
      },
      url: `${process.env.NBA_PLATFORM}public/member/memberteam/${tel}`,
    };

    const response = await axios(request);

    return response.data;
  } catch (error) {
    return {status: false, message: error.message};
  }
}

async function GetMemberAll() {
  try {
    console.log(`${process.env.NBAPLATFROM}`);
    let config = {
      method: "get",
      headers: {},
      url: `${process.env.NBA_PLATFROM}admin/member`,
    };
    const response = await axios(config);
    return response;
  } catch (error) {
    return {status: false, message: error.message};
  }
}

module.exports = {GetTeamMember, GetMemberAll};
