const {
  ProductGraphic,
} = require("../../../models/pos.models/product.graphic.model");
const {
  ProductGraphicPrice,
} = require("../../../models/pos.models/product.graphic.price.model");
const {
  ProductGraphicCategory,
} = require("../../../models/pos.models/product.graphic.category.model");
const {
  OrderServiceModel,
  validate,
} = require("../../../models/order.service.model/order.service.model");
const {WalletHistory} = require("../../../models/wallet.history.model");
const {Shop} = require("../../../models/pos.models/shop.model");
const {Partners} = require("../../../models/pos.models/partner.model");
const {Employee} = require("../../../models/pos.models/employee.model");
const {Percent} = require("../../../models/pos.models/percent.profit.model");
const getmemberteam = require("../../../lib/getPlateformMemberTeam");
const {Commission} = require("../../../models/commission.model");
const dayjs = require("dayjs");
const line = require("../../../lib/line.notify.order");

module.exports.order = async (req, res) => {
  try {
    const checkuser = await Employee.findOne({_id: req.user._id});
    if (!checkuser) {
      return res.status(403).send({message: "ไม่พบข้อมูลผู้ใช้"});
    } else {
      const findshop = await Shop.findOne({
        _id: checkuser.employee_shop_id,
      });
      if (!findshop) {
        return res.status(403).send({message: "ไม่พบข้อมูล Shop"});
      } else {
        const partner = await Partners.findById({
          _id: findshop.shop_partner_id,
        });
        const amount = req.body.product_detail.length;
        let product_price = 0;
        for (let i = 0; i < amount; i++) {
          const graphicpackage = await ProductGraphicPrice.findOne({
            _id: req.body.product_detail[i].packageid,
          });
          const total = graphicpackage.price + graphicpackage.freight;
          product_price = product_price + total;
        }
        if (partner.partner_wallet < product_price) {
          return res.status(400).send({
            status: false,
            message: "ยอดเงินไม่ในกระเป๋าไม่เพียงพอ",
          });
        } else {
          // getorder
          const orders = [];
          let packagedetail;
          let total_price = 0;
          let total_cost = 0;
          let total_freight = 0;
          for (let item of req.body.product_detail) {
            const container = await ProductGraphicPrice.findOne({
              _id: item.packageid,
            });
            if (container) {
              const productgraphic = await ProductGraphic.findOne({
                _id: container.product_graphic_id,
              });
              if (productgraphic) {
                const platfromprofit =
                  container.price - (container.profit_NBA + container.cost_NBA);
                // let packagedetail = `${productgraphic.description} ${item.detail}`;

                // let calculatefreight = 0;

                //ราคาขาย ไม่รวมค่าขนส่ง
                if (productgraphic.detail === "ราคาต่อตารางเมตร") {
                  packagedetail = `${item.width}*${item.hight} ${productgraphic.description} ${item.detail}`;
                  const data = (item.width / 100) * (item.hight / 100);
                  if (data < 1) {
                    total_price = container.price;
                  } else {
                    total_price =
                      container.price *
                      ((item.width / 100) * (item.hight / 100));
                  }
                } else {
                  packagedetail = `${productgraphic.description} ${item.detail}`;
                  total_price = container.price;
                }

                //ราคาต้นทุน
                if (productgraphic.detail === "ราคาต่อตารางเมตร") {
                  const data = (item.width / 100) * (item.hight / 100);
                  if (data < 1) {
                    total_cost = container.cost_NBA * item.quantity;
                  } else {
                    total_cost =
                      container.cost_NBA *
                      ((item.width / 100) * (item.hight / 100)) *
                      item.quantity;
                  }
                } else {
                  total_cost = container.cost_NBA * item.quantity;
                }

                //ค่าขนส่ง
                if (productgraphic.detail === "ราคาต่อตารางเมตร") {
                  const data = (item.width / 100) * (item.hight / 100);
                  if (data < 1) {
                    total_freight = container.freight;
                  } else {
                    const freight =
                      ((item.width / 100) * (item.hight / 100) - 1) * 10;
                    total_freight = container.freight + freight;
                  }
                } else if (productgraphic.detail === "ราคาต่อชิ้น") {
                  total_freight = container.freight * item.quantity;
                } else if (productgraphic.detail === "ราคาต่อชุด") {
                  total_freight = container.freight;
                }

                console.log(total_freight);

                orders.push({
                  packageid: container._id,
                  packagename: productgraphic.name,
                  packagedetail: packagedetail,
                  quantity: item.quantity,
                  price: total_price,
                  cost: total_cost,
                  freight: total_freight,
                });
              } else {
                return res
                  .status(403)
                  .send({status: false, message: "ไม่พบข้อมูลสินค้า"});
              }
            }
          }
//           const totalprice = orders.reduce(
//             (accumulator, currentValue) => accumulator + currentValue.price,
//             0
//           );
//           const totalfreight = orders.reduce(
//             (accumulator, currentValue) => accumulator + currentValue.freight,
//             0
//           );

//           const totalcost = orders.reduce(
//             (accumulator, currentValue) => accumulator + currentValue.cost,
//             0
//           );

//           //ตัดเงิน
//           const newwallet =
//             partner.partner_wallet - (totalprice + totalfreight);
//           await Partners.findByIdAndUpdate(partner._id, {
//             partner_wallet: newwallet,
//           });

//           //generate receipt number
//           const receiptnumber = await GenerateRiceiptNumber(
//             findshop.shop_partner_type,
//             findshop.shop_branch_id
//           );

//           const data = {
//             receiptnumber: receiptnumber,
//             customer_contact: req.body.customer_contact,
//             customer_name: req.body.customer_name,
//             customer_tel: req.body.customer_tel,
//             customer_address: req.body.customer_address,
//             customer_iden_id: req.body.customer_iden_id,
//             customer_line: req.body.customer_line,
//             partnername: "shop",
//             servicename: "Artwork",
//             shopid: findshop._id,
//             shop_partner_type: findshop.shop_partner_type,
//             branch_name: findshop.shop_name,
//             branch_id: findshop.shop_branch_id,
//             product_detail: orders,
//             paymenttype: req.body.paymenttype,
//             moneyreceive: req.body.moneyreceive,
//             total_cost: totalcost,
//             total_price: totalprice,
//             total_freight: totalfreight,
//             net: totalprice + totalfreight,
//             status: {
//               name: "รอการตรวจสอบ",
//               timestamp: dayjs(Date.now()).format(""),
//             },
//             timestamp: dayjs(Date.now()).format(""),
//           };

//           const order = new OrderServiceModel(data);

//           const getteammember = await getmemberteam.GetTeamMember(
//             req.body.customer_tel
//           );

//           if (!getteammember) {
//             return res.status(403).send({message: "ไม่พบข้อมมูลลูกค้า"});
//           } else {
//             order.save(async (error, data) => {
//               if (data) {
//                 const findorderid = await OrderServiceModel.findById({
//                   _id: data._id,
//                 });

//                 const code = "Service";
//                 const percent = await Percent.findOne({code: code});

//                 const commisstion = totalprice - totalcost;
//                 const platfromcommission = (commisstion * 80) / 100;
//                 const bonus = (commisstion * 5) / 100;
//                 const allSale = (commisstion * 15) / 100;

//                 const level = getteammember.data;
//                 const validLevel = level.filter((item) => item !== null);
//                 const storeData = [];
//                 const platform = percent.percent_platform;
//                 //calculation from 80% for member
//                 const owner = (platfromcommission * platform.level_owner) / 100;
//                 const lv1 = (platfromcommission * platform.level_one) / 100;
//                 const lv2 = (platfromcommission * platform.level_two) / 100;
//                 const lv3 = (platfromcommission * platform.level_tree) / 100;

//                 //calculation vat 3%
//                 const ownervat = (owner * 3) / 100;
//                 const lv1vat = (lv1 * 3) / 100;
//                 const lv2vat = (lv2 * 3) / 100;
//                 const lv3vat = (lv3 * 3) / 100;

//                 //real commission for member
//                 const ownercommission = owner - ownervat; //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน
//                 const lv1commission = lv1 - lv1vat; //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน
//                 const lv2commission = lv2 - lv2vat; //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน
//                 const lv3commission = lv3 - lv3vat; //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน

//                 for (const TeamMemberData of validLevel) {
//                   let integratedData;

//                   if (TeamMemberData.level == "owner") {
//                     integratedData = {
//                       lv: TeamMemberData.level,
//                       iden: TeamMemberData.iden,
//                       name: TeamMemberData.name,
//                       address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
//                       tel: TeamMemberData.tel,
//                       commission_amount: owner,
//                       vat3percent: ownervat,
//                       remainding_commission: ownercommission,
//                     };
//                   }
//                   if (TeamMemberData.level == "1") {
//                     integratedData = {
//                       lv: TeamMemberData.level,
//                       iden: TeamMemberData.iden,
//                       name: TeamMemberData.name,
//                       address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
//                       tel: TeamMemberData.tel,
//                       commission_amount: lv1,
//                       vat3percent: lv1vat,
//                       remainding_commission: lv1commission,
//                     };
//                   }
//                   if (TeamMemberData.level == "2") {
//                     integratedData = {
//                       lv: TeamMemberData.level,
//                       iden: TeamMemberData.iden,
//                       name: TeamMemberData.name,
//                       address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
//                       tel: TeamMemberData.tel,
//                       commission_amount: lv2,
//                       vat3percent: lv2vat,
//                       remainding_commission: lv2commission,
//                     };
//                   }
//                   if (TeamMemberData.level == "3") {
//                     integratedData = {
//                       lv: TeamMemberData.level,
//                       iden: TeamMemberData.iden,
//                       name: TeamMemberData.name,
//                       address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
//                       tel: TeamMemberData.tel,
//                       commission_amount: lv3,
//                       vat3percent: lv2vat,
//                       remainding_commission: lv3commission,
//                     };
//                   }
//                   if (integratedData) {
//                     storeData.push(integratedData);
//                   }
//                 }

//                 const commissionData = {
//                   data: storeData,
//                   platformcommission: platfromcommission,
//                   bonus: bonus,
//                   allSale: allSale,
//                   orderid: findorderid,
//                   code: "Service",
//                 };

//                 const commission = new Commission(commissionData);
//                 commission.save((error, data) => {
//                   if (error) {
//                     console.log(error);
//                     return res
//                       .status(403)
//                       .send({status: false, message: "ไม่สามารถบันทึกได้"});
//                   }
//                   const wallethistory = {
//                     shop_id: findshop._id,
//                     partner_id: partner._id,
//                     orderid: findorderid._id,
//                     name: `รายการสั่งซื้อ Artwork ใบเสร็จเลขที่ ${findorderid.receiptnumber}`,
//                     type: "เงินออก",
//                     amount: findorderid.net,
//                   };
//                   const walletHistory = new WalletHistory(wallethistory);
//                   walletHistory.save();
//                 });
//                 const message = `
// แจ้งงานเข้า : ${order.servicename}
// เลขที่ทำรายการ : ${order.receiptnumber}
// จาก : ${order.branch_name}
// จำนวน : ${order.total_price} บาท
// ตรวจสอบได้ที่ : http://shop-admin.nbadigitalservice.com/

// *ฝากแอดมินรบกวนตรวจสอบด้วยนะคะ/ครับ* `;
//                 await line.linenotify(message);
//                 return res.status(200).send({
//                   status: true,
//                   data: data,
//                   ยอดเงินคงเหลือ: newwallet,
//                 });
//               } else {
//                 console.error(error);
//                 return res.status(400).send({
//                   message: "ไม่สามารถบันทึกได้",
//                   error: error.message,
//                 });
//               }
//             });
//           }
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};

async function GenerateRiceiptNumber(shop_partner_type, branch_id) {
  if (shop_partner_type === "One Stop Service") {
    const pipeline = [
      {
        $match: {shop_partner_type: shop_partner_type},
      },
      {
        $group: {_id: 0, count: {$sum: 1}},
      },
    ];
    const count = await OrderServiceModel.aggregate(pipeline);
    const countValue = count.length > 0 ? count[0].count + 1 : 1;
    const data = `REP${dayjs(Date.now()).format("YYYYMMDD")}${countValue
      .toString()
      .padStart(5, "0")}`;
    return data;
  } else {
    const pipeline = [
      {
        $match: {
          $and: [
            {shop_partner_type: shop_partner_type},
            {branch_id: branch_id},
          ],
        },
      },
      {
        $group: {_id: 0, count: {$sum: 1}},
      },
    ];
    const count = await OrderServiceModel.aggregate(pipeline);
    const countValue = count.length > 0 ? count[0].count + 1 : 1;
    const data = `RE${dayjs(Date.now()).format("YYYYMMDD")}${countValue
      .toString()
      .padStart(5, "0")}`;
    console.log(count);
    return data;
  }
}
