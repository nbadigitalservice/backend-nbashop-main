const mongoose = require('mongoose')
const { Commission } = require('../models/commission.model')

module.exports.GetCommissionByTel = async (req, res) => {
    try {
        const { tel } = req.params

        const pipeline = [
            {
                $unwind: '$data'
            },
            {
                $match: { 'data.tel': tel }
            },
            {
                $group: {
                    _id: '$data.tel',
                    totalRemainingCommission: { $sum: '$data.remainding_commission' }
                }
            },
            {
                $project: {
                    _id: 0,
                    tel: '$_id',
                    totalRemainingCommission: 1
                }
            }
        ];

        const result = await Commission.aggregate(pipeline);

        if (result.length === 0) {
            return res.status(404).send({ message: 'ไม่พบเบอร์ที่ตรงกัน', data: [] });
        }

        return res.status(200).send({ message: 'ดึงข้อมูลสำเร็จ', data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'เกิดข้อผิดพลาดบางอย่าง', data: error.data });
    }
}

module.exports.GetUnsummedCommissionsByTel = async (req, res) => {
    try {
        const { tel } = req.params

        const pipeline = [
            {
                $unwind: '$data'
            },
            {
                $match: { 'data.tel': tel }
            },
            {
                $project: {
                    _id: 0,
                    tel: '$data.tel',
                    iden: '$data.iden',
                    name: '$data.name',
                    address: '$data.address',
                    tel: '$data.tel',
                    commission_amount: '$data.commission_amount',
                    vat3percent: '$data.vat3percent',
                    remainding_commission: '$data.remainding_commission',
                    orderid: '$orderid'
                }
            }
        ];

        const result = await Commission.aggregate(pipeline)

        if (result.length === 0) {
            return res.status(404).send({ message: 'ไม่พบเบอร์ที่ตรงกัน', data: [] })
        }

        return res.status(200).send({ message: 'ดึงข้อมูลสำเร็จ', data: result })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'เกิดข้อผิดพลาดบางอย่าง', data: error.data })
    }
}