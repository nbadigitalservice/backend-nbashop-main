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

module.exports.GetTotalBonus = async (req, res) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: null,
                    totalBonus: { $sum: '$bonus' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalBonus: 1
                }
            }
        ];

        const result = await Commission.aggregate(pipeline);

        return res.status(200).send({ message: 'ดึงข้อมูลสำเร็จ', data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'มีบางอย่างผิดพลาด', data: error.data });
    }
}

module.exports.GetTotalAllSale = async (req, res) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: null,
                    totalAllSale: { $sum: '$allSale' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAllSale: 1
                }
            }
        ];

        const result = await Commission.aggregate(pipeline);

        return res.status(200).send({ message: 'ดึงข้อมูลสำเร็จ', data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'มีบางอย่างผิดพลาด', data: error.data });
    }
}

module.exports.GetCommissionByOrderId = async (req, res) => {
    try {
        const commission = await Commission.find({ orderid: req.params.id });
        console.log(commission)
        if (!commission) {
            return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' });

        } else {
            return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: commission });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
    }
}

//get All order
module.exports.GetAll = async (req, res) => {
    try {
      const commission = await Commission.find()
      return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: commission })
  
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: 'server side error' })
    }
  }