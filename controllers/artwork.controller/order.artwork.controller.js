const {
  PreorderArtwork,
  validate,
} = require("../../models/artwork.model/preorder.artwork.model");
const {Shop} = require('../../models/pos.models/shop.model')
const {ArtworkList} = require("../../models/artwork.model/artwork.list.model");
const dayjs = require("dayjs");
const Joi = require("joi");
const { default: axios } = require("axios");
const { Partners } = require("../../models/pos.models/partner.model");
const { MoneyHistory } = require("../../models/more.model/money.history.model");
const { linenotify } = require("../../lib/line.notify");

exports.check = async (req, res) => {
  //เงื่อนไขตรวจสอบข้อมูลเข้ามา
  const vali = (data) => {
    const schema = Joi.object({
      type: Joi.string().required().label("ไม่มีข้อมูลประเภทสื่อสิ่งพิมพ์"),
      format: Joi.number().required().label("ไม่พบรูปแบบของสื่อสิ่งพิมพ์"), // 1 = หน้าเดียว 2 = สองหน้า
      size: Joi.string().required().label("ไม่พบขนาดหรือชื่อขนาด"),
      width: Joi.number().required().label("ไม่พบความกว้าง เซนติเมตร"),
      height: Joi.number().required().label("ไม่พบความสูง/ยาว เซ็นติเมตร"),
    });

    return schema.validate(data);
  };
  try {
    const {error} = vali(req.body);
    if (error) {
      return res
        .status(400)
        .send({status: false, message: error.details[0].message});
    }

    const artwork = await ArtworkList.findOne({type: req.body.type});
    if (artwork) {
      let data = null;
      switch (artwork.type) {
        case "vinyl":
          const price_unit = artwork.detail[0].price;
          const square_metter =
            ((req.body.width * req.body.height) / 10000) * req.body.format;
          const price = square_metter * price_unit;
          data = {
            ...req.body,
            square_metter: square_metter, //จำนวนตารางเมตรรวม
            price: price, //ราคาสุทธิ
            ref: artwork.detail[0], // อ้างอิง
          };
          break;
        default:
          return res
            .status(400)
            .send({status: false, message: "ไม่พบบริการสื่อสิ่งพิมพ์นี้"});
      }

      return res.status(200).send({status: true, data: data});
    } else {
      return res
        .status(400)
        .send({status: false, message: "ไม่พบบริการสื่อสิ่งพิมพ์นี้"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.confirm = async (req, res)=>{
  try{
    const {error} = validate(req.body);
    if(error){
      return res.status(400).send({status: false, message: error.details[0].message})
    }
    //check shop
    const shop = await Shop.findById(req.body.shop_id);
    if(!shop){
      return res.status(400).send({status: false, message: 'ไม่พบร้านค้านี้ในระบบ'})
    }
    const partner = await Partners.findById(shop.shop_partner_id);
    if(!partner){
      return res.status(400).send({status: false, message: 'ร้านค้านี้ไม่มีพาร์ทเนอร์ในระบบ'})
    }
    //ตรวจสอบยอดเงินในกระเป๋า partner
    if(partner.partner_wallet < req.body.total){
      return res.status(400).send({status: false, message: 'ยอดเงินไม่ในกระเป๋าไม่เพียงพอ'})
    }

    // const share = await marketShare(req.body.total);
    const invoice = await invoiceNumber(req.body.timestamp);
    const poartwork = await PreorderArtwork.create({invoice:invoice, ...req.body});
    
    if(poartwork){
      //หักเงินและบันทึกเงิน partner
      const new_wallet = partner.partner_wallet - req.body.total;
      await Partners.findByIdAndUpdate(partner._id, {partner_wallet: new_wallet });
      //บันทึกลงในประวัติ
      const history = {
        shop_id : shop._id,
        partner_id : partner._id,
        name : `ออกแบบสื่อสิ่งพิมพ์ เลขที่ ${invoice}`,
        type : 'เงินออก',
        amount : req.body.total,
        detail : 'ไม่มี',
        timestamp : req.body.timestamp
      }
      await MoneyHistory.create(history);
      console.log('สร้ารายการสำเร็จ : '+invoice);
      //แจ้งเตือนไลน์
      const message = `
*ออกแบบสื่อสิ่งพิมพ์*
ประเภทงาน : ${poartwork.artwork_type}
---เกี่ยวกับร้านค้า---
ร้านค้า : ${shop.shop_name}
สาขา : ${shop.shop_number}
---เกี่ยวกับงาน---
จำนวน ${poartwork.order_detail.filter((el)=>el.code==='artwork').length} งาน

ตรวจสอบได้ที่ : https://shop-admin.nbadigitalservice.com

*รีบๆ ตรวจสอบและส่งงานให้กราฟฟิกกันน๊าาา*
*ตั้งใจทำงานการนะคะ/ครับ*
`
      await linenotify(message);
      return res.status(200).send({status: true, message: 'สร้างรายการสั่งซื้อสำเร็จ', data: poartwork})

    }else{
      return res.status(400).send({status: false, message: 'สร้างรายการไม่สำเร็จ'});
    }

  }catch(err){
    console.log(err);
    return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
  }
}

//ค้นหาและสร้างเลข invoice
async function invoiceNumber(date) {
  const order = await PreorderArtwork.find();
  let invoice_number = null;
  if (order.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `ART${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      check = await PreorderArtwork.find({invoice: data});
      if (check.length === 0) {
        invoice_number =
          `ART${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    invoice_number = `ART${dayjs(date).format("YYYYMM")}`.padEnd(13, "0") + "1";
  }
  return invoice_number;
}
