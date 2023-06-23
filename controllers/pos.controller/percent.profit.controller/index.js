const {
  Percent,
  validate,
} = require("../../../models/pos.models/percent.profit.model");
const {ProductNBA} = require("../../../models/pos.models/product.nba.model");

exports.findAll = async (req, res) => {
  try {
    Percent.find()
      .then(async (data) => {
        res.send({data: data[0], message: "success", status: true});
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
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    Percent.findById(id)
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({message: "ไม่สามารถหารายการนี้ได้", status: false});
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

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    Percent.findByIdAndRemove(id, {useFindAndModify: false})
      .then((data) => {
        console.log(data);
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถลบรายการนี้ได้`,
            status: false,
          });
        } else {
          res.send({
            message: "ลบรายการนี้เรียบร้อยเเล้ว",
            status: true,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "ไม่สามารถลบรายการนี้ได้",
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
exports.update = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "ส่งข้อมูลผิดพลาด",
      });
    }
    const id = req.params.id;

    Percent.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
      .then((data) => {
        console.log(data);
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถเเก้ไขข้อมูลนี้ได้`,
            status: false,
          });
        } else
          res.send({
            message: "แก้ไขข้อมูลนี้เรียบร้อยเเล้ว",
            status: true,
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบ่างอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};
exports.create = async (req, res) => {
  console.log("สร้าง");
  try {
    const {error} = validate(req.body);

    if (error)
      return res
        .status(400)
        .send({message: error.details[0].message, status: false});
    const result = await new Percent({
      ...req.body,
    })
      .save()
      .catch((err) => console.log(err));
    console.log(result);
    res.status(201).send({
      message: "เพิ่มข้อมูลสำเร็จ",
      status: true,
      result: result,
    });
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.vatUpdate = async (req, res) => {
  try {
    const product = await ProductNBA.find({productNBA_vat_status: true});
    for (let i = 0; i < product.length; i++) {
      const vat_sell = (product[i].productNBA_cost * 7) / 107; //ภาษีขาย
      const vat_buy = (product[i].productNBA_cost_nba * 7) / 107; //ภาษีซื้อ
      const difference =
        product[i].productNBA_cost -
        product[i].productNBA_cost_nba -
        (vat_sell - vat_buy); //ส่วนต่างยังไม่สุทธิ
      const productNBA_more = {
        difference: Number(difference.toFixed(2)),
        vat_sell: Number(vat_sell.toFixed(2)),
        vat_buy: Number(vat_buy.toFixed(2)),
      };
      await ProductNBA.findByIdAndUpdate(product[i]._id, {
        productNBA_more: {...productNBA_more},
      });
    }
    return res
      .status(200)
      .send({status: true, message: "อัพเดตภาษีซื้อภาษีขายเรียบร้อยแล้ว"});
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.updateShare = async (req, res) => {
  try {
    const per = await Percent.findById("637ef06a7e98ac71b872197d");
    if (!per) {
      return res
        .status(400)
        .send({status: false, message: "ไม่พบอัตราส่วนแบ่งในฐานข้อมูล"});
    }
    const product = await ProductNBA.find();
    for (let i = 0; i < product.length; i++) {
      const profit =
        product[i].productNBA_more.difference -
        product[i].productNBA_profit.nba;
      const platform = (profit * per.percent.platform) / 100;
      const terrestrial = (profit * per.percent.terrestrial) / 100;
      const central = (profit * per.percent.central) / 100;

      const pf = {
        level_owner: (platform * per.percent_platform.level_owner) / 100,
        level_one: (platform * per.percent_platform.level_one) / 100,
        level_two: (platform * per.percent_platform.level_two) / 100,
        level_tree: (platform * per.percent_platform.level_tree) / 100,
      };

      const ter = {
        district: (terrestrial * per.percent_terrestrial.district) / 100,
        state: (terrestrial * per.percent_terrestrial.state) / 100,
        province: (terrestrial * per.percent_terrestrial.province) / 100,
        bonus: (terrestrial * per.percent_terrestrial.bonus) / 100,
      };

      const cent = {
        central: (central * per.percent_central.central) / 100,
        allsale: (central * per.percent_central.allsale) / 100,
      };
      const data = {
        productNBA_profit: {
          nba: product[i].productNBA_profit.nba,
          platform: {...pf},
          terrestrial: {...ter},
          central: {...cent},
        },
      };
      await ProductNBA.findByIdAndUpdate(product[i]._id, data);
    }

    return res
      .status(200)
      .send({status: true, message: "อัพเดตการแบ่งปันเรียบร้อยแล้ว"});
  } catch (err) {
    console.log(err);
    return res.status(500).send({messsage: "มีบางอย่างผิดพลาด"});
  }
};
