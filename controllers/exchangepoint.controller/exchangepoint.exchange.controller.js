const { PremiumItem } = require('../../models/exchangepoint.model/premiumitem.model')
const getmemberteam = require('../../lib/getPlateformMemberTeam')
const { Commission } = require('../../models/commission.model')
const { ExchangeHistory } = require('../../models/exchangepoint.model/exchangehistory.model')
const jwt = require('jsonwebtoken')

module.exports.exchange = async (req, res) => {
    try {
        const token = req.headers['auth-token']
        console.log(token)
        if (token) {
            jwt.verify(token, process.env.API_PARTNER_KEY, (err, decoded) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send({ message: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ', data: err.data })
                } else {
                    console.log('decodeddecodeddecodeddecoded', decoded)
                    return res.status(200).send({ message: 'hello', data: decoded })
                }
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error.data })
    }
}