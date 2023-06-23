const {
  ProductNBA,
  validate,
} = require("../../../models/pos.models/product.nba.model");

exports.create = async (req, res) => {
  try {
    ProductNBA.findOne({
      productNBA_barcode: req.body.barcode,
    }).then((value) => {
      if (value) {
        res
          .status(401)
          .send({ message: "มีรหัส Barcode นี้แล้ว ", status: false });
      } else {
        res.status(200).send({
          message: "สามารถใช้รหัส Barcode นี้ได้ ",
          status: true,
          barcode: req.body.barcode,
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
