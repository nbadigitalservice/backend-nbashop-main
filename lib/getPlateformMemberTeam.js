const axios = require('axios')

async function GetTeamMember(tel) {
    try {
        const request = {
        method: 'get',
        headers: {
            'token': process.env.NBA_PLATFORM_SECRET_KEY,
        },
        url: `${process.env.NBA_PLATFORM}public/member/memberteam/${tel}`,
    };

    const response = await axios(request)

    return response.data
    } catch (error) {
        return {status: false, message: error.message}
    }
    
}

module.exports = { GetTeamMember }