const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')
const { OrderCanceled } = require('../../models/order.service.model/order.canceled.model')
const { AccountPackageModel } = require('../../models/account.service.model/account.service.package.model')
const { ActPackageModel } = require('../../models/act.service.model/act.service.package.model')
const { FacebookPackage } = require('../../models/facebook.model/facebook.package.model')
const { InsurancePackageModel } = require('../../models/insurance.model/insurance.package.model')
const { ItsupportPackage } = require('../../models/itsupport.model/itsupport.package.model')
const { WebsitePackageModel } = require('../../models/website.package.model/website.package.model')
const { ProductGraphicPrice } = require('../../models/pos.models/product.graphic.price.model')
const { Partners } = require('../../models/pos.models/partner.model')

module.exports.confirm = async (req, res) => {

  const updateStatus = await OrderServiceModel.findOne({ _id: req.params.id })
  console.log(updateStatus);
  if (updateStatus) {
    await OrderServiceModel.findByIdAndUpdate(updateStatus._id, { status: 'กำลังดำเนินการ' })
  } else {
    return res.status(403).send({ message: 'เกิดข้อผิดพลาด' })
  } return res.status(200).send({ message: 'คอนเฟิร์มออร์เดอร์สำเร็จ' })
}

//get All order
module.exports.GetAll = async (req, res) => {
  try {
    console.log(req.decoded)
    const orderservice = await OrderServiceModel.find()
    return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: orderservice })

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: 'server side error' })
  }
}

//get order by id
module.exports.GetById = async (req, res) => {
  try {
    const orderservice = await OrderServiceModel.findById(req.params.id)
    if (!orderservice) {
      return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' })

    } else {
      return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: orderservice })
    }

  } catch (error) {
    console.error(error)
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
  }
}

module.exports.GetTotalPriceSumByTel = async (req, res) => {
  try {
    const tel = req.params.tel
    const pipeline = [
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
    ];

    const result = await OrderServiceModel.aggregate(pipeline)

    return res.status(200).send({ message: 'ดึงข้อมูลสำเร็จ', data: result })
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'มีบางอย่างผิดพลาด', data: error.data })
  }
}

module.exports.cancel = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderServiceModel.findOne({ _id: orderId });

    if (!order) {
      return res.status(403).send({ message: 'ไม่พบข้อมูลออร์เดอร์' });
    }

    // Check if the order is already cancelled
    if (order.status === 'ถูกยกเลิก') {
      return res.status(200).send({ message: 'ออร์เดอร์ถูกยกเลิกแล้ว' });
    }

    // Mark the order as cancelled
    await OrderServiceModel.findByIdAndUpdate(orderId, { status: 'ถูกยกเลิก' });

    // Calculate total refund amount using the modified getProductPackageModel function
    const totalRefundAmount = await getProductPackageModel(order.servicename, order.product_detail);
    console.log('totalRefundAmounttotalRefundAmounttotalRefundAmounttotalRefundAmount', totalRefundAmount)

    // Create an entry in the 'ordercanceled' schema
    const canceledOrder = new OrderCanceled({
      orderid: order._id,
      receiptnumber: order.receiptnumber,
      cost: totalRefundAmount,
      customer_name: order.customer_name,
      customer_tel: order.customer_contact,
      refund_amount: totalRefundAmount,
      reason: req.body.reason,
      admin_id: req.decoded._id,
      admin_name: req.decoded.name,
    });

    await canceledOrder.save();

    // Find the partner using their ID
    const partner = await Partners.findOne({ partner_phone: order.customer_tel });

    if (!partner) {
      return res.status(403).send({ message: 'ไม่พบข้อมูลพาร์ทเนอร์' });
    }

    // Update the partner's wallet by adding the refund amount
    partner.partner_wallet += totalRefundAmount;
    await partner.save();

    return res.status(200).send({ message: 'ยกเลิกออร์เดอร์และบันทึกข้อมูลสำเร็จ', data: canceledOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'มีบางอย่างผิดพลาด', error: error.message });
  }
}



async function getProductPackageModel(servicename, product_detail) {
  let packageModel;
  let totalRefundAmount = 0;

  switch (servicename) {
    case 'Account Service':
      packageModel = AccountPackageModel;
      break;
    case 'Act of legislation Service(พรบ.)':
      packageModel = ActPackageModel;
      break;
    case 'Facebook Service':
      packageModel = FacebookPackage;
      break;
    case 'Insurance Service(ประกัน)':
      packageModel = InsurancePackageModel;
      break;
    case 'IT Support Service':
      packageModel = ItsupportPackage;
      break;
    case 'Website Service':
      packageModel = WebsitePackageModel;
      break;
    case 'Artwork':
      packageModel = ProductGraphicPrice;
      break;
    default:
      throw new Error('ไม่สามารถระบุแพ็คเกจที่ถูกยกเลิกได้');
  }

  // Calculate total refund amount based on quantity and package cost
  for (const product of product_detail) {
    let packageData;

    if (servicename === 'Artwork') {
      packageData = await ProductGraphicPrice.findOne({ _id: product.packageid });
    } else {
      packageData = await packageModel.findOne({ _id: product.packageid });
    }

    if (!packageData) {
      throw new Error('ไม่พบข้อมูลแพ็คเกจ');
    }

    if (servicename === 'Artwork') {
      const cost = packageData.cost_NBA;
      totalRefundAmount += product.quantity * cost;
    } else {
      totalRefundAmount += product.quantity * packageData.cost;
    }
  }

  return totalRefundAmount;
}

module.exports.acceptTask = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderServiceModel.findOne({ _id: orderId });

    if (!order) {
      return res.status(403).send({ message: 'ไม่พบข้อมูลออร์เดอร์' });
    }

    await OrderServiceModel.findByIdAndUpdate(orderId, {
      status: req.body.status,
      responsible_id: req.body._id,
      responsible_name: req.body.name,
    });

    return res.status(200).send({ message: 'รับงานแล้ว', data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'มีบางอย่างผิดพลาด', error: error.message });
  }
}

//get All canceled order
module.exports.GetAllCanceledOrder = async (req, res) => {
  try {
    console.log(req.decoded)
    const ordercanceled = await OrderCanceled.find()
    return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: ordercanceled })

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: 'server side error' })
  }
}

//get canceled order by id
module.exports.GetCanceledOrderById = async (req, res) => {
  try {
    const ordercanceled = await OrderCanceled.findById(req.params.id)
    if (!ordercanceled) {
      return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' })

    } else {
      return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: ordercanceled })
    }

  } catch (error) {
    console.error(error)
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
  }
}

//get canceled order by tel
module.exports.GetCanceledOrderByTel = async (req, res) => {
  try {
    const tel = req.params.tel
    const ordercanceled = await OrderCanceled.find({ customer_tel: tel })
    if (!ordercanceled) {
      return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' })

    } else {
      return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: ordercanceled })
    }

  } catch (error) {
    console.error(error)
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
  }
}