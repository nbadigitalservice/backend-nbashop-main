const axios = require("axios");

async function GetTeamMember(tel) {
  try {
    const request = {
      method: "get",
      headers: {},
      url: `${process.env.NBA_PLATFORM}public/member/memberteam/${tel}`,
    };

    const response = await axios(request);
    return response.data;
  } catch (error) {
    return {status: false, message: error.message};
  }
}

async function GetMemberByTel(tel) {
  try {
    const request = {
      method: "get",
      headers: {
        token: process.env.NBA_PLATFORM_SECRET_KEY,
      },
      url: `${process.env.NBA_PLATFORM}public/member/tel/${tel}`,
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

async function GiveCommission(packageData) {
  try {
    const request = {
      method: "post",
      headers: {},
      url: `${process.env.NBA_PLATFORM}public/member/givecommission`,
      data: packageData,
    };

    const response = await axios(request);
    return response.data;
  } catch (error) {
    return {status: false, message: error.message};
  }
}

module.exports = {GetTeamMember, GetMemberAll, GetMemberByTel, GiveCommission};
