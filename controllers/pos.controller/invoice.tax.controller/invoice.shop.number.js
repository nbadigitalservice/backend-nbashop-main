const dayjs = require("dayjs");
const { Shop, validate } = require("../../../models/pos.models/shop.model");

exports.create = async (req, res) => {
  try {
    Shop.find().then((value) => {
      console.log(value);
      if (!value) {
        res.status(404);
      } else {
        console.log("ค่าที่รีเทอนกลับมา =>>>>>>> ", value);
        const valueMath = Math.max(
          ...value.map((o) => parseInt(o.shop_number))
        );
        console.log(valueMath);
        if (valueMath === -Infinity) {
          res.send({
            status: true,
            shop_number: `00001`,
          });
        } else if (valueMath < 9) {
          res.send({
            status: true,
            shop_number: `0000${valueMath + 1}`,
          });
        } else if (valueMath.length < 99) {
          res.send({
            status: true,
            shop_number: `0000${valueMath + 1}`,
          });
        } else if (valueMath < 999) {
          res.send({
            status: true,
            shop_number: `000${valueMath + 1}`,
          });
        } else if (valueMath < 9999) {
          res.send({
            status: true,
            shop_number: `00${valueMath + 1}`,
          });
        } else {
          res.send({
            status: true,
            shop_number: `${valueMath + 1}`,
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
