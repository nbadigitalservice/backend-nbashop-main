const axios = require('axios')

async function GetTeamMember(tel) {
    const request = {
        method: 'get',
        headers: {
            'token': process.env.PLATFORM_PUBLIC_KEY,
        },
        url: `${process.env.NBA_PLATFORM}public/member/memberteam/${tel}`,
    };

    const response = await axios(request)

    return response.data
}

module.exports = { GetTeamMember }