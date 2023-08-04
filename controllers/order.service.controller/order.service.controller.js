const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')

module.exports.confirm = async (req, res) => {
    const updateStatus = await OrderServiceModel.findOne({ _id: req.body.orderid });
    console.log(updateStatus);
    if (updateStatus) {
      await OrderServiceModel.findByIdAndUpdate(updateStatus._id, { status: 'กำลังดำเนินการ'})
    } else {
      return res.status(403).send({ message: 'เกิดข้อผิดพลาด' })
    } return res.status(200).send({ message: 'คอนเฟิร์มออร์เดอร์สำเร็จ' })
  }
  
  module.exports.complete = async (req, res) => {
    const updateStatus = await OrderServiceModel.findOne({ _id: req.body.orderid });
    console.log(updateStatus);
    if (updateStatus) {
      await OrderServiceModel.findByIdAndUpdate(updateStatus._id, { status: 'เสร็จสิ้นการดำเนินการ'})
    } else {
      return res.status(403).send({ message: 'เกิดข้อผิดพลาด' })
    } return res.status(200).send({ message: 'ส่งออร์เดอร์สำเร็จ' })
  }