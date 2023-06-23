const { InvoiceShop, validate } = require("../../../models/pos.models/invoice.shop.model");

exports.findAll = async (req, res, next) => {
  try {
    InvoiceShop.find()
      .then(async (data) => {
        res.status(201).send({ data, message: "success", status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "มีบางอย่างผิดพลาด",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    InvoiceShop.findById(id)
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: "ไม่สามารถหารายงานนี้ได้", status: false });
        else res.send({ data, status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
exports.getByShopId = async (req,res)=>{
  const shop_id = req.params.shop_id;
  try{
    const invoice = await InvoiceShop.find({invoice_shop_id : shop_id});
    if(invoice){
      return res.status(200).send({status: true, data: invoice})
    }else{
      return res.status(400).send({status: true, message : "ดึงข้อมูลใบสั่งซื้อไม่สำเร็จ"})
    }
  }catch(err){
    console.log(err);
    return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
  }
}
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    InvoiceShop.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถลบรายงานนี้ได้`,
            status: false,
          });
        } else {
          res.send({
            message: "ลบรายงานนี้เรียบร้อยเเล้ว",
            status: true,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "ไม่สามารถลบรายงานนี้ได้",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "ไม่สามารถลบรายงานนี้ได้",
      status: false,
    });
  }
};
