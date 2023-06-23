const dayjs = require("dayjs");
const {
  PreOrderNBA,
  validate,
} = require("../../../models/pos.models/preorder.nba.model");

exports.create = async (req, res) => {
  try {
    PreOrderNBA.find().then((value) => {
      console.log(value);
      if (!value) {
        res.status(404);
      } else {
        console.log("ค่าที่รีเทอนกลับมา =>>>>>>> ", value);
        const findDate = value.filter(
          (item) =>
            dayjs(item.ponba_timestamp[0].timestamp).format("MM/YYYY") ===
            dayjs(req.body.date).format("MM/YYYY")
        );
        if (findDate.length < 9) {
          res.send({
            status: true,
            invoice_preorder_nba: `${dayjs(req.body.date).format("YYYYMM")}00000${
              findDate.length + 1
            }`,
          });
        } else if (findDate.length < 99) {
          res.send({
            status: true,
            invoice_preorder_nba: `${dayjs(req.body.date).format("YYYYMM")}0000${
              findDate.length + 1
            }`,
          });
        } else if (findDate.length < 999) {
          res.send({
            status: true,
            invoice_preorder_nba: `${dayjs(req.body.date).format("YYYYMM")}000${
              findDate.length + 1
            }`,
          });
        } else if (findDate.length < 9999) {
          res.send({
            status: true,
            invoice_preorder_nba: `${dayjs(req.body.date).format("YYYYMM")}00${
              findDate.length + 1
            }`,
          });
        } else if (findDate.length < 99999) {
          res.send({
            status: true,
            invoice_preorder_nba: `${dayjs(req.body.date).format("YYYYMM")}0${
              findDate.length + 1
            }`,
          });
        } else if (findDate.length < 999999) {
          res.send({
            status: true,
            invoice_preorder_nba: `${dayjs(req.body.date).format("YYYYMM")}${
              findDate.length + 1
            }`,
          });
        }
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
