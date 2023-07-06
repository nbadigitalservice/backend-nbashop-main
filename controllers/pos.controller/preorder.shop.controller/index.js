const {
  PreOrderShop,
  validate,
} = require("../../../models/pos.models/preorder.shop.model");

const {Shop} = require("../../../models/pos.models/shop.model");
const {InvoiceShop} = require("../../../models/pos.models/invoice.shop.model");
const line = require("../../../lib/line.notify");

const Joi = require("joi");
const dayjs = require("dayjs");
exports.findAll = async (req, res) => {
  try {
    PreOrderShop.find()
      .then(async (data) => {
        res.send({data, message: "success", status: true});
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
    PreOrderShop.findById(id)
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
    PreOrderShop.findByIdAndRemove(id, {useFindAndModify: false})
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

    PreOrderShop.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
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
    console.log("error");
    if (error)
      return res
        .status(400)
        .send({message: error.details[0].message, status: false});

    const result = await new PreOrderShop({
      ...req.body,

      //เพิ่มข้อมูลการแบ่งปันตรงนี้


      //end
    }).save();
    res.status(201).send({
      message: "เพิ่มข้อมูลสำเร็จ",
      status: true,
      poshop: result,
    });
  } catch (error) {
    res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
  }
};

exports.findByShopId = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    PreOrderShop.find({poshop_shop_id: id})
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

//cut off
exports.cutoff = async (req, res) => {
  console.log("Cutoff midnight");
  try {
    const va = (data) => {
      const schema = Joi.object({
        api_key: Joi.string().required().label("ไม่พบ api key"),
      });
      return schema.validate(data);
    };
    const {error} = va(req.body);

    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }
    if (req.body.api_key !== process.env.CRON_JOB) {
      return res
        .status(400)
        .send({status: false, message: "Api Key ไม่ถูกต้อง"});
    }

    const poshop = await PreOrderShop.find({poshop_cutoff: false});
    if (poshop.length === 0) {
      //แจ้งเตือนไลน์
      const message = `
  ตัดยอดระหว่างวันสำเร็จ ไม่มีการสร้างใบแจ้งหนี้ เนื่องจากร้านค้ากดปิดงานเอง หรือ ร้านค้าไม่มีการขาย `;
      await line.linenotify(message);
      return res.status(400).send({message: "ไม่มีรายการขาย"});
    }
    //หาร้านค้าที่ยังไม่ได้สร้างใบแจ้งหนี้หรือตัดรอบส่งต้นทุน
    const shop_arr = [...new Set(poshop.map((obj) => obj.poshop_shop_id))];

    shop_arr.forEach(async (el) => {
      let invoice_detail = [];
      let invoice_poshop = [];
      //หาใบ po ของร้านนั้นๆ
      const po = await poshop.filter((po) => po.poshop_shop_id === el);
      po.forEach(async (p) => {
        invoice_poshop.push(p);
        p.poshop_detail.forEach(async (pd) => {
          //ตรวจสอบว่ามีใน invoice detail แล้วหรือยัง
          const check = await invoice_detail.find(
            (el) => el.productShop_barcode === pd.productShop_barcode
          );
          if (check) {
            //กรณีมีอยู่แล้ว  ทำการบวกเพิ่ม
            const position = invoice_detail.findIndex(
              (el) => el.productShop_barcode
            );
            const new_data = {
              ...check,
              amount: check.amount + pd.amount,
              summary:
                check.summary + pd.product_ref.productNBA_cost * pd.amount,
            };
            invoice_detail.splice(position, 1, new_data);
          } else {
            //นำเข้าใหม่
            const new_data = {
              productShop_barcode: pd.productShop_barcode,
              productNBA_id: pd.product_ref._id,
              name: pd.product_ref.productNBA_name,
              amount: pd.amount,
              cost: pd.product_ref.productNBA_cost,
              summary: pd.product_ref.productNBA_cost * pd.amount,
            };

            invoice_detail.push(new_data);
          }
        });
      });
      //สร้างใบแจ้งหนี้
      const invoice = await invoiceNumber(el, dayjs(Date.now()).format())
      // let invoice;
      // const shop = await Shop.findOne({_id: el});
      // if (shop) {
      //   invoice = `${shop.shop_number}${dayjs(Date.now()).format(
      //     "YYMMDDHHmmss"
      //   )}`;
      // } else {
      //   invoice = "ร้านค้าถูกลบจากฐานข้อมูล";
      // }

      const invoice_data = {
        invoice_ref: invoice,
        invoice_shop_id: el,
        invoice_detail: invoice_detail,
        invoice_status: "ค้างชำระ",
        invoice_timestamp: dayjs(Date.now()).format(),
        invoice_poshop: invoice_poshop,
      };
      await InvoiceShop.create(invoice_data);
      await PreOrderShop.updateMany(
        {poshop_shop_id: el},
        {$set: {poshop_cutoff: true}}
      );
    });

    //แจ้งเตือนไลน์
    const message = `
ตัดยอดระหว่างวันสำเร็จ
สร้างใบแจ้งหนี้จำนวน : ${shop_arr.length
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} รายการ
*หมายเหตุ :* คือร้านที่ไม่ได้กดปิดงานเพื่อส่งยอดเอง
            `;
    await line.linenotify(message);

    return res.status(200).send({
      message: `ตัดยอดใบแจ้งหนี้ชำระต้นทุนของร้านค้าเรียบร้อย จำนวน ${shop_arr.length} ร้านค้า`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

//ค้นหาและสร้างเลข invoice
async function invoiceNumber(shop_id, date) {
  const shop = await Shop.findById(shop_id);
  if (shop) {
    const order = await InvoiceShop.find({invoice_shop_id:shop_id});
    let invoice_number = null;
    if (order.length !== 0) {
      let data = "";
      let num = 0;
      let check = null;
      do {
        num = num + 1;
        data = `${shop.shop_number}${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
        check = await InvoiceShop.find({invoice_ref: data});
        if (check.length === 0) {
          invoice_number =
            `${shop.shop_number}${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
        }
      } while (check.length !== 0);
    } else {
      invoice_number = `${shop.shop_number}${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + "1";
    }
    console.log(invoice_number);
    return invoice_number;
  } else {
    return "0";
  }
}
