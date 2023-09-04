const { TaxReverseModel } = require('../../models/tax.service.model/tax.service.reverse.model')
const { Partners } = require('../../models/pos.models/partner.model')
const { Shop } = require('../../models/pos.models/shop.model')
const { Employee } = require('../../models/pos.models/employee.model')

module.exports.GetByOrderId = async (req, res) => {
    try {
        const id = req.params.id
        const pipeline = [
            {
                $match: { orderid: id }
            },
            {
                $project: {
                    _id: 1,
                    orderid: 1,
                    name: 1,
                    price: 1,
                    reverse_price: 1,
                    servicecharge: 1,
                    tax_value: 1,
                    tax_mulct_value: 1,
                    traffic_mulct_value: 1,
                    other: 1,
                    status: 1,
                    updatedAt: 1,
                }
            }
        ]
        const GetTaxRevers = await TaxReverseModel.aggregate(pipeline)
        return res.status(403).send({ message: 'ดึงข้อมูลสำเร็จ', data: GetTaxRevers })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error })
    }
}

module.exports.GetByShopId = async (req, res) => {
    try {
        const id = req.user._id;
        const employee = await Employee.findById(id);
        const findShop = await Shop.findOne({ _id: employee.employee_shop_id });
        let shopId = findShop._id.toString()
        console.log(shopId)
        
        const pipeline = [
            {
                $match: { shopid: shopId }
            },
            {
                $project: {
                    _id: 1,
                    orderid: 1,
                    name: 1,
                    price: 1,
                    reverse_price: 1,
                    servicecharge: 1,
                    tax_value: 1,
                    tax_mulct_value: 1,
                    traffic_mulct_value: 1,
                    other: 1,
                    status: 1,
                    updatedAt: 1,
                }
            }
        ];

        const GetTaxRevers = await TaxReverseModel.aggregate(pipeline);
        return res.status(200).send({ message: 'ดึงข้อมูลสำเร็จ', data: GetTaxRevers });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server', data: error });
    }
};
