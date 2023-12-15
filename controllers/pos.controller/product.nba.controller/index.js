const {
  ProductNBA,
  validate,
} = require("../../../models/pos.models/product.nba.model");

exports.findAll = async (req, res) => {
  try {
    console.log("Get All Product NBA");
    const product = await ProductNBA.find();
    if (product) {
      return res.status(200).send({data: product, status: true});
    } else {
      return res
        .status(400)
        .send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"});
    }
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

module.exports.findProductDemo = async (req, res) => {
  try {
    console.log("Get All Product NBA");
    const product = await ProductNBA.find();
    if (product) {
      return res.status(200).send({data: product, status: true});
    } else {
      return res
        .status(400)
        .send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"});
    }
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    ProductNBA.findById(id)
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({message: "ไม่สามารถหารายงานนี้ได้", status: false});
        else res.send({data, status: true});
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

exports.getByBarcode = async (req, res) => {
  try {
    const barcode = req.params.barcode;
    const product = await ProductNBA.findOne({productNBA_barcode: barcode});
    if (product) {
      return res.status(200).send({status: true, data: product});
    } else {
      return res
        .status(400)
        .send({status: false, message: "ไม่พบข้อมูลสินค้า"});
    }
  } catch (err) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.findByCredit = async (req, res) => {
  try {
    const product = await ProductNBA.find({productNBA_status_type: "เครดิต"});
    if (product) {
      return res.status(200).send({status: true, data: product});
    } else {
      return res
        .status(400)
        .send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.findByConsignment = async (req, res) => {
  try {
    const product = await ProductNBA.find({productNBA_status_type: "ฝากขาย"});
    if (product) {
      return res.status(200).send({status: true, data: product});
    } else {
      return res
        .status(400)
        .send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    ProductNBA.findByIdAndRemove(id, {useFindAndModify: false})
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

exports.findByDealerId = async (req, res, next) => {
  const id = req.params.id;
  try {
    ProductNBA.find({productNBA_dealer_id: id})
      .then(async (data) => {
        res.status(201).send({data, message: "success", status: true});
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "มีบางอย่างผิดพลาด",
        });
      });
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
