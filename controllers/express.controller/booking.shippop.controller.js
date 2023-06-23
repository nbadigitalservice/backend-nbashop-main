const {
  PercentCourier,
  validate,
} = require("../../models/express.model/precent.courier.model");
const {
  OrderExpress,
} = require("../../models/express.model/order.express.model");
const {Shop} = require("../../models/pos.models/shop.model");
const {Partners} = require("../../models/pos.models/partner.model");
const {MoneyHistory} = require("../../models/more.model/money.history.model");
const {
  BookingParcel,
  validate_parcel,
} = require("../../models/express.model/booking.parcel.model");
const axios = require("axios");
const dayjs = require("dayjs");
const {
  AddressSender,
} = require("../../models/express.model/address.sender.model");
const {
  AddressRecipient,
} = require("../../models/express.model/address.recipient.model");
//check  ราคา
exports.pricelist = async (req, res) => {
  try {
    const percent = await PercentCourier.find();
    let data = [];
    data.push(req.body);
    const value = {
      api_key: process.env.SHIPPOP_API_KEY,
      data: data,
    };
    const resp = await axios.post(
      `${process.env.SHIPPOP_URL}/pricelist/`,
      value,
      {
        headers: {"Accept-Encoding": "gzip,deflate,compress"},
      }
    );
    if (!resp.data.status) {
      return res.status(400).send({status: false, message: resp.data.message});
    }
    const obj = resp.data.data[0];
    const new_data = [];
    Object.keys(obj).forEach(async (ob) => {
      let v = null;
      //const calPrice = await calPriceCourier(obj[ob]);
      let p = percent.find((c) => c.courier_code === obj[ob].courier_code);
      if (!p) {
        p = percent.find((c) => c.courier_code === "OTHER");
        if (!p) {
          p = {
            percent_code: "NONE",
            percent_nba: 5,
            percent_shop: 10,
          };
        }
      }
      //คำนวนต้นทุนของร้านค้า
      let cost_nba = Number(obj[ob].price);
      let cost = cost_nba + (cost_nba * p.percent_nba) / 100; // ต้นทุน nba + ((ต้นทุน nba * เปอร์เซ็น nba)/100)
      let price = cost + (cost * p.percent_shop) / 100;
      v = {
        ...obj[ob],
        cost_nba: cost_nba,
        cost: cost,
        price: Number(price.toFixed()),
      };
      new_data.push(v);
    });
    return res
      .status(200)
      .send({status: true, origin_data: req.body, data: new_data});
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: err._message});
  }
};

exports.booking = async (req, res) => {
  try {
    console.log("data body : ", req.body);

    const percent = await PercentCourier.find();
    let data = [];

    for (let i = 0; i < req.body.parcel.length; i++) {
      data.push(req.body.parcel[i].detail);
    }

    //check สมุดผู้รับ / ผู้ส่ง
    const shop_id = req.body.shop_id;

    //sender
    const sender = data[0].origin; //ผู้ส่ง

    const address_sender = await AddressSender.find({
      shop_id: shop_id,
      tel: sender.tel,
    });
    if (address_sender.length === 0) {
      const data_sender = {
        ...sender,
        shop_id: shop_id,
        postcode: String(sender.postcode),
      };
      await AddressSender.create(data_sender);
    }

    //recipient
    for (let r = 0; r < data.length; r++) {
      const address_recipient = await AddressRecipient.find({
        shop_id: shop_id,
        tel: data[r].to.tel,
      });
      if (address_recipient.length === 0) {
        const recipient = data[r].to; //ผู้รับ
        const data_recipient = {
          ...recipient,
          shop_id: shop_id,
          postcode: String(recipient.postcode),
        };
        await AddressRecipient.create(data_recipient);
      }
    }

    const value = {
      api_key: process.env.SHIPPOP_API_KEY,
      email: "nbadigitalservice@gmail.com",
      data: data,
    };

    const resp = await axios.post(
      `${process.env.SHIPPOP_URL}/booking/`,
      value,
      {
        headers: {"Accept-Encoding": "gzip,deflate,compress"},
      }
    );

    if (!resp.data.status) {
      return res.status(400).send({status: false, message: resp.data.message});
    }

    //ค่าตอบกลับจาก shippop
    const obj = resp.data.data;
    const new_data = [];
    let total = 0;
    let total_cost = 0;
    Object.keys(obj).forEach(async (ob) => {
      const parcel = req.body.parcel[ob].detail.parcel;
      let v = null;
      let p = percent.find((c) => c.courier_code === obj[ob].courier_code);
      if (!p) {
        p = percent.find((c) => c.courier_code === "OTHER");
        if (!p) {
          p = {
            percent_code: "NONE",
            percent_nba: 5,
            percent_shop: 10,
          };
        }
      }
      //คำนวนต้นทุนของร้านค้า
      let cost_nba = Number(obj[ob].price);
      let cost = cost_nba + (cost_nba * p.percent_nba) / 100; // ต้นทุน nba + ((ต้นทุน nba * เปอร์เซ็น nba)/100)
      let price = cost + (cost * p.percent_shop) / 100;
      total = total + Number(price);
      total_cost = total_cost + Number(cost);
      v = {
        purchase_id: String(resp.data.purchase_id),
        origin: req.body.origin,
        shop_id: req.body.shop_id,
        parcel: parcel,
        ...obj[ob],
        cost_nba: cost_nba,
        cost: cost,
        price: Number(price.toFixed()),
        timestamp: req.body.timestamp,
      };
      new_data.push(v);
    });
    const booking_parcel = await BookingParcel.insertMany(new_data);
    //const booking_parcel = new_data;
    return res.status(200).send({
      status: true,
      purchase_id: String(resp.data.purchase_id),
      total: Number(total.toFixed()),
      total_cost: Number(total_cost.toFixed(2)),
      data: booking_parcel,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: err._message});
  }
};

//Confrim purchase_id
exports.confirm = async (req, res) => {
  try {
    const {purchase_id, shop_id} = req.body;
    if (purchase_id === undefined || shop_id === undefined) {
      return res
        .status(500)
        .send({status: false, message: "รับข้อมูลไม่ครบถ้วน"});
    }

    const booking = await BookingParcel.find({
      shop_id: shop_id,
      purchase_id: purchase_id,
    });

    //ส่ง api ยืนยันกับทาง shippop
    const value = {
      api_key: process.env.SHIPPOP_API_KEY,
      purchase_id: purchase_id,
    };
    const resp = await axios.post(
      `${process.env.SHIPPOP_URL}/confirm/`,
      value,
      {
        headers: {"Accept-Encoding": "gzip,deflate,compress"},
      }
    );

    if (!resp.data.status) {
      return res.status(400).send({status: false, message: resp.data.message});
    }
    for (let i = 0; i < booking.length; i++) {
      await BookingParcel.findByIdAndUpdate(booking[i]._id, {
        order_status: "booking",
      });
    }
    console.log("ยืนยันใบสั่งซื้อ : " + purchase_id);
    return res
      .status(200)
      .send({status: true, message: "ยืนยันใบสั่งซื้อเรียบร้อยแล้ว"});
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: err._message});
  }
};

exports.cancel = async (req, res) => {
  try {
    const {purchase_id, shop_id} = req.body;
    if (!purchase_id || !shop_id) {
      return res.status(400).send({status: false, message: "ไม่พบข้อมูล"});
    }

    //ค้นหา order express
    const order_express = await OrderExpress.findOne({
      purchase_id: purchase_id,
      shop_id: shop_id,
    });

    if (!order_express) {
      return res.status(400).send({message: "ไม่มีใบสั่งซื้อที่ต้องการยกเลิก"});
    }
    console.log("Order Express : ", order_express);
    //หา partner ของร้านค้า
    const shop = await Shop.findById(order_express.shop_id);
    const partner = await Partners.findById(shop.shop_partner_id);

    const booking = await BookingParcel.find({
      shop_id: shop_id,
      purchase_id: purchase_id,
      order_status: "booking",
    });

    if (booking.length === 0) {
      return res.status(400).send({
        status: true,
        message:
          "ไม่สามารถยกเลิกได้ เนื่องจากพัสดุถูกยกเลิกหรือขนส่งรับพัสดุไปแล้ว",
      });
    }

    //ตรวจสอบสถานะของพัสดุว่าสามารถยกเลิกได้ไหม
    // const cost = booking.reduce((sum, booking) => sum + booking.cost, 0);
    let cost = 0;

    console.log("ยกเลิกพัสดุ ต้นทุน : ", cost);
    if (booking.length > 0) {
      for (let i = 0; i < booking.length; i++) {
        await axios
          .post(
            `${process.env.SHIPPOP_URL}/cancel`,
            {
              api_key: process.env.SHIPPOP_API_KEY,
              tracking_code: booking[i].tracking_code,
            },
            {
              headers: {"Accept-Encoding": "gzip,deflate,compress"},
            }
          )
          .then(async () => {
            console.log(
              "/---ยกเลิกเลขพัสดุ " + booking[i].tracking_code + " เรียบร้อย"
            );

            const parcel = await BookingParcel.findOne({
              tracking_code: booking[i].tracking_code,
            });

            if (parcel) {
              console.log(
                "---ถูกยกเลิกพัสดุ tracking_code : " + booking[i].tracking_code
              );

              await BookingParcel.findByIdAndUpdate(parcel._id, {
                order_status: "cancel",
              }).then(() => {
                cost = booking[i].cost + cost;
              });
            }
          });
      } //end loop for

      console.log("ต้นทุนคืนกระเป๋าพาร์ทเนอร์ร้านค้า : ", cost);
      // อัพเดต สถานะ order express
      console.log("อัพเดตสถานะ Order Express");
      const new_status = {
        name: "ยกเลิก",
        timestamp: dayjs(Date.now()).format(),
      };
      order_express.status.push(new_status);
      console.log("New Status", new_status);
      await OrderExpress.findByIdAndUpdate(order_express._id, {
        status: order_express.status,
      });

      // คืนเงินเข้ากระเป๋า
      console.log("คืนเงินเข้ากระเป๋า");
      const new_money = partner.partner_wallet + cost;
      await Partners.findByIdAndUpdate(partner._id, {
        partner_wallet: new_money,
      });
      // บันทึกประวัติเงินเข้ากระเป๋า
      console.log("บันทึกประวัติเงินเข้า-ออก");
      const money_history = {
        shop_id: order_express.shop_id,
        partner_id: partner._id,
        name: `ยกเลิกพัสดุ ใบสั่งซื้อเลขที่ ${order_express.purchase_id}`,
        type: "เงินเข้า",
        amount: cost,
        detail: "ไม่มี",
        timestamp: dayjs(Date.now()).format(),
      };
      await MoneyHistory.create(money_history);
      console.log("---เสร็จสิ้น---");

      return res
        .status(200)
        .send({status: true, message: "ยกเลิกพัสดุเรียบร้อย"});
    } else {
      return res
        .status(400)
        .send({status: false, messgae: "ดึงข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.checkTrackingCode = async (req, res) => {
  try {
    if (req.body.tracking_code === undefined) {
      return res.status(400).send({message: "กรุณากรอกเลข tracking code"});
    }
    const value = {
      tracking_code: req.body.tracking_code,
    };
    const shippop = await axios.post(
      `${process.env.SHIPPOP_URL}/tracking/`,
      value
    );
    console.log(shippop.data);
    if (shippop) {
      return res.status(200).send(shippop.data);
    } else {
      return res.status(400).send({message: "ตรวจสอบข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.label = async (req, res) => {
  try {
    console.log(req.body);
    const {shop_id, purchase_id} = req.body;
    if (shop_id === undefined || purchase_id === undefined) {
      return res
        .status(400)
        .send({status: false, message: "รับข้อมูลไม่ครบถ้วน"});
    }

    const booking = await BookingParcel.find({
      shop_id: shop_id,
      purchase_id: purchase_id,
    });
    const tracking_code = [];
    let option = {};
    for (let i = 0; i < booking.length; i++) {
      if (booking[i].status !== "cancel") {
        tracking_code.push(booking[i].tracking_code);
      }
      option[booking[i].tracking_code] = {
        replaceOrigin: {...booking[i].origin},
      };
    }

    const value = {
      api_key: process.env.SHIPPOP_API_KEY,
      purchase_id: purchase_id,
      tracking_code: String(tracking_code),
      size: "sticker4x6",
      logo: "https://nbadigitalworlds.com/img/nba-express2.png",
      type: "html",
      options: option,
    };

    const resp = await axios.post(
      `${process.env.SHIPPOP_URL}/v2/label/`,
      value,
      {
        headers: {"Accept-Encoding": "gzip,deflate,compress"},
      }
    );
    return res.status(200).send(resp.data);
  } catch (err) {
    return res.status(500).send({message: err._message});
  }
};

//Get All Bookin Only Admin
exports.getAllBooking = async (req, res) => {
  try {
    const booking = await BookingParcel.find();
    if (booking) {
      return res.status(200).send({status: true, data: booking});
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

//Booking Parcel
exports.getBooking = async (req, res) => {
  try {
    const shop_id = req.params.shop_id;
    const booking_parcel = await BookingParcel.find({shop_id: shop_id});
    if (booking_parcel) {
      return res.status(200).send({status: true, data: booking_parcel});
    } else {
      return res
        .status(400)
        .send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: err._message});
  }
};

exports.callback = async (req, res) => {
  console.log("--Callback จากทาง SHIPPOP--");
  console.log(req.body);
  console.log(dayjs(Date.now()).format());
  try {
    const parcel = await BookingParcel.findOne({
      tracking_code: req.body.tracking_code,
    });
    if (parcel) {
      if (req.body.order_status === "cancel") {
        console.log(
          "---ถูกยกเลิกพัสดุ tracking_code : " + req.body.tracking_code
        );
        if (parcel.order_status !== "cancel") {
          const shop = await Shop.findOne({_id: parcel.shop_id});
          const partner_id = shop.shop_partner_id;
          const partner = await Partners.findOne({_id: partner_id});
          //คืนต้นทุนต่อชิ้น
          const new_wallet = partner.partner_wallet + parcel.cost;
          //อัพเดตกระเป๋า partner
          const update_wallet = await Partners.findByIdAndUpdate(partner_id, {
            partner_wallet: new_wallet,
          });
          if (update_wallet) {
            console.log("คืนเงินเข้ากระเป๋า partner : " + partner.partner_name);
            console.log("ยอด : " + parcel.cost);
            //บันทึกเงินเข้ากระเป๋า partner
            const history = {
              shop_id: shop._id,
              partner_id: partner_id,
              name: `ยกเลิกพัสดุ เลขติดตามพัสดุ : ${parcel.courier_tracking_code}`,
              type: "เงินเข้า",
              detail: `ใบสั่งซื้ออ้างอิงเลขที่ ${parcel.purchase_id} , tracking code : ${parcel.tracking_code}
ยกเลิกโดย บริษัทขนส่งหรือผู้ให้บริการขนส่งเอง`,
              amount: parcel.cost,
              timestamp: dayjs(Date.now()).format(),
            };
            await MoneyHistory.create(history);
          }
        }
      } else if (req.body.order_status === "package_detail") {
        //ราคาที่เก็บเพิ่ม
        const chargeable_price =
          Number(req.body.data.chargeable_price) - parcel.cost_nba;
        if (chargeable_price > 0) {
          //ถ้าส่วนต่างมากกว่า 0 ให้ทำการหักกระเป๋าเงินของ platner ของ shop นั้น
          const shop = await Shop.findById(parcel.shop_id);
          const partner = await Partners.findById(shop.shop_partner_id);
          if (partner) {
            //อัพเดตกระเป๋าวอลเลตใหม่
            const new_wallet = partner.partner_wallet - chargeable_price;
            await Partners.findByIdAndUpdate(partner._id, {
              partner_wallet: new_wallet,
            });
            await BookingParcel.findByIdAndUpdate(parcel._id, {
              package_detail_status: true,
            });
            //บันทึกประวัติเงินเข้า-ออก
            const data_history = {
              shop_id: shop._id,
              partner_id: partner._id,
              name: `หักเงินส่วนต่างเก็บเพิ่มจากพัสดุเลขติดตามพัสดุ ${parcel.courier_tracking_code}`,
              type: "เงินออก",
              amount: chargeable_price,
              detail: `เนื่องจากกรอกข้อมูลพัสดุไม่ตรงขนาดและน้ำหนักจริง จึงมีการอัพเดตข้อมูลพัสดุเพิ่มเติม`,
            };
            await MoneyHistory.create(data_history);
            console.log("มีการหักส่วนต่างจำนวน/บาท : ", chargeable_price);
          } else {
            console.log("ไม่พบ partner ไม่สามารถหักเงินในกระเป๋าได้");
          }
        }
        //กรณีมีการเติมเพิ่ม
        await BookingParcel.findByIdAndUpdate(parcel._id, {
          package_detail: req.body.data,
        });
      }

      //ถ้าส่งสถานะสำเร็จมา ให้ทำการตรวจสอบ Platform ถ้ามีเบอร์ให้เพิ่มเติม
      if (req.body.order_status === "complete") {
        const platform = await axios
          .get(
            `${process.env.NBA_PLATFORM}public/member/tel/${parcel.origin.tel}`,
            {
              headers: {
                'token': `${process.env.PLATFORM_PUBLIC_KEY}`,
              },
            }
          ).catch((err)=>{
            console.log(err.response.data);
          })

        if(platform){
          const data_point = {
            tel : parcel.origin.tel,
            point : parcel.price
          }
          
          await axios.post(`${process.env.NBA_PLATFORM}public/member/givehappypoint`, data_point,{
            headers : {
              'token' : process.env.PLATFORM_PUBLIC_KEY
            }
          }).then(()=>{
            console.log('ให้คะแนนเรียบร้อย : ', parcel.price)
          }).catch((err)=>{
            console.log(err);
          })
          
        }
      }

      //อัพเดตสถานะ
      await BookingParcel.findByIdAndUpdate(parcel._id, {
        order_status: req.body.order_status,
      }).then(() => {
        console.log('อัพเดตพัสดุสำเร็จสถานะสำเร็จ')
        return res
          .status(200)
          .send({status: true, message: "อัพเดตสถานะสำเร็จ"});
      });
    } else {
      return res
        .status(400)
        .send({status: false, message: "ไม่สามารถใช้งานได้"});
    }
  } catch (err) {
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.updateCourierTrackingCode = async (req, res) => {
  try {
    if (req.body.tracking_code === undefined) {
      return res.status(400).send({message: "ไม่พบ traking_code"});
    }

    const parcel = await BookingParcel.findOne({
      tracking_code: req.body.tracking_code,
    });
    if (parcel) {
      const shippop = await axios.post(`${process.env.SHIPPOP_URL}/tracking/`, {
        tracking_code: req.body.tracking_code,
      });
      if (shippop) {
        if (shippop.data.status) {
          const update = await BookingParcel.findByIdAndUpdate(parcel._id, {
            courier_tracking_code: shippop.data.courier_tracking_code,
          });
          if (update) {
            const new_data = await BookingParcel.findById(parcel._id);
            return res.status(200).send({status: true, data: new_data});
          } else {
            return res
              .status(400)
              .send({message: "อัพเดต Courier Tracking Code ไม่สำเร็จ"});
          }
        } else {
          return res.status(400).send({message: "ไม่พบ tracking code"});
        }
      } else {
        return res.status(400).send({message: "ตรวจสอบข้อมูลไม่สำเร็จ"});
      }
    } else {
      return res.status(400).send({message: "ไม่พบ Tracking Code ในฐานข้อมูล"});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

exports.callToPickup = async (req, res) => {
  try {
    if (req.body.courier_tracking_code === undefined) {
      return res.status(400).send({message: "ไม่พบเลขติดตามพัสดุ"});
    }

    const shippop = await axios.post(
      `${process.env.SHIPPOP_URL}/calltopickup/`,
      {
        api_key: process.env.SHIPPOP_API_KEY,
        tracking_code: String(req.body.courier_tracking_code),
      }
    );
    if (shippop.data.status) {
      return res.status(200).json(shippop.data);
    } else {
      return res.status(400).json(shippop.data);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};
