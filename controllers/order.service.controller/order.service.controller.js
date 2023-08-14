const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')

module.exports.confirm = async (req, res) => {
  const updateStatus = await OrderServiceModel.findOne({ _id: req.body.orderid });
  console.log(updateStatus);
  if (updateStatus) {
    await OrderServiceModel.findByIdAndUpdate(updateStatus._id, { status: 'กำลังดำเนินการ' })
  } else {
    return res.status(403).send({ message: 'เกิดข้อผิดพลาด' })
  } return res.status(200).send({ message: 'คอนเฟิร์มออร์เดอร์สำเร็จ' })
}

module.exports.complete = async (req, res) => {
  const updateStatus = await OrderServiceModel.findOne({ _id: req.body.orderid });
  console.log(updateStatus);
  if (updateStatus) {
    await OrderServiceModel.findByIdAndUpdate(updateStatus._id, { status: 'เสร็จสิ้นการดำเนินการ' })
  } else {
    return res.status(403).send({ message: 'เกิดข้อผิดพลาด' })
  } return res.status(200).send({ message: 'ส่งออร์เดอร์สำเร็จ' })
}

//get All order
module.exports.GetAll = async (req, res) => {
  try {
    const orderservice = await OrderServiceModel.find();
    return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: orderservice })

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: 'server side error' })
  }
}

//get order by id
module.exports.GetById = async (req, res) => {
  try {
    const orderservice = await OrderServiceModel.findById(req.params.id);
    if (!orderservice) {
      return res.status(403).send({ status: false, message: 'ไม่พบข้อมูล' });

    } else {
      return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: orderservice });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" })
  }
}