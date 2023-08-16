const { PremiumItem } = require('../../models/exchangepoint.model/premiumitem.model')
const getmemberteam = require('../../lib/getPlateformMemberTeam')
const { Commission } = require('../../models/commission.model')
const { ExchangeHistory } = require('../../models/exchangepoint.model/exchangehistory.model')
const { OrderServiceModel } = require('../../models/order.service.model/order.service.model')
const jwt = require('jsonwebtoken')
const axios = require('axios')

module.exports.exchange = async (req, res) => {
    try {

        //หา item 
        const finditem = await PremiumItem.findOne({ _id: req.body.item_id })
        if (finditem) {
            let token = req.headers['auth-token']
            jwt.verify(token, process.env.API_PARTNER_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(403).send({ message: 'ไม่พบข้อมูลผู้ใช้ในระบบ' })
                } else {
                    const tel = req.body.tel
                    // create exchange history
                    let data = {
                        tel: tel,
                        item_id: req.body.item_id,
                        name: finditem.name,
                        exchangerate: finditem.exchangerate,
                    }
                    const exchangehistory = new ExchangeHistory(data)
                    exchangehistory.save(error => {
                        if (error) {
                            console.error(error)
                            return res.status(403).send({ message: 'ไม่สามารถบันทึกได้' })
                        }
                    })

                    //หา allsale
                    const allSalePipeline = [
                        {
                            $match: { customer_tel: tel }
                        },
                        {
                            $group: {
                                _id: '$customer_tel',
                                userAllsale: { $sum: '$totalprice' }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                customer_tel: '$_id',
                                userAllsale: 1
                            }
                        }
                    ]
                    const allSaleResult = await OrderServiceModel.aggregate(allSalePipeline)
                    console.log(allSaleResult)

                    //หาแต้มใช้แลกรวม
                    const ExchangeRatePipeline = [
                        {
                            $match: { tel: tel }
                        },
                        {
                            $group: {
                                _id: '$tel',
                                totalExchangeRate: { $sum: '$exchangerate' }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                tel: '$_id',
                                totalExchangeRate: 1
                            }
                        }
                    ];

                    const totalExchangeRateResult = await ExchangeHistory.aggregate(ExchangeRatePipeline);
                    console.log(totalExchangeRateResult)

                    //คำนวนหา happy point
                    const happyPoint = allSaleResult[0].userAllsale - totalExchangeRateResult[0].totalExchangeRate
                    console.log(happyPoint)

                    //ลดจำนวน item ในสต๊อก
                    const newValueStock = finditem.stock - 1
                    await PremiumItem.findByIdAndUpdate(finditem._id, { stock: newValueStock })
                    
                    return res.status(200).send({ message: 'แลกเปลี่ยนสำเร็จ', data: data, UserAllsale: allSaleResult, TotalExchangePoint: totalExchangeRateResult, HAPPY_POINT: happyPoint })
                }
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error.data })
    }
}