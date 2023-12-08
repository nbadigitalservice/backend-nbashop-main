const {
  TaxPackageModel,
} = require("../../models/tax.service.model/tax.service.package.model");
const {
  TaxReverseModel,
} = require("../../models/tax.service.model/tax.service.reverse.model");
const {
  TaxCategoryModel,
} = require("../../models/tax.service.model/tax.service.category.model");
const {
  OrderServiceModel,
  validate,
} = require("../../models/order.service.model/order.service.model");
const {WalletHistory} = require("../../models/wallet.history.model");
const line = require("../../lib/line.notify.order");
const {Shop} = require("../../models/pos.models/shop.model");
const {Partners} = require("../../models/pos.models/partner.model");
const {Employee} = require("../../models/pos.models/employee.model");
const {Percent} = require("../../models/pos.models/percent.profit.model");
const getmemberteam = require("../../lib/getPlateformMemberTeam");
const {Commission} = require("../../models/commission.model");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const multer = require("multer");
const fs = require("fs");
const {google} = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    // console.log(file.originalname);
  },
});

module.exports.order = async (req, res) => {
  try {
    const checkuser = await Employee.findOne({_id: req.user._id});
    if (!checkuser) {
      return res.status(403).send({message: "User not found"});
    } else {
      const findshop = await Shop.findOne({_id: checkuser.employee_shop_id});
      if (!findshop) {
        return res.status(403).send({message: "Shop not found"});
      } else {
        const orders = [];
        let packagedetail;
        let total_price = 0;
        let total_cost = 0;
        let total_freight = 0;
        let total_platfrom = 0;
        for (let item of req.body.product_detail) {
          const container = await TaxPackageModel.findOne({
            _id: item.packageid,
          });
          if (container) {
            const taxpackage = await TaxCategoryModel.findOne({
              _id: container.categoryid,
            });
            packagedetail = `${container.name} ${container.detail} ${taxpackage.name} ${item.detail}`;
            total_price = container.price;

            total_cost = container.cost;

            total_freight = 0;

            total_platfrom = 0;

            orders.push({
              packageid: container._id,
              packagename: container.name,
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
        const totalprice = orders.reduce(
          (accumulator, currentValue) => accumulator + currentValue.price,
          0
        );
        const totalfreight = orders.reduce(
          (accumulator, currentValue) => accumulator + currentValue.freight,
          0
        );

        const totalcost = orders.reduce(
          (accumulator, currentValue) => accumulator + currentValue.cost,
          0
        );

        //generate receipt number
        const receiptnumber = await GenerateRiceiptNumber(
          findshop.shop_partner_type,
          findshop.shop_branch_id
        );

        const data = {
          receiptnumber: receiptnumber,
          customer_contact: req.body.customer_contact,
          customer_name: req.body.customer_name,
          customer_tel: req.body.customer_tel,
          customer_address: req.body.customer_address,
          customer_iden_id: req.body.customer_iden_id,
          customer_line: req.body.customer_line,
          partnername: "shop",
          servicename: "Tax Service (ภาษี)",
          shopid: findshop._id,
          shop_partner_type: findshop.shop_partner_type,
          branch_name: findshop.shop_name,
          branch_id: findshop.shop_branch_id,
          product_detail: orders,
          paymenttype: req.body.paymenttype,
          moneyreceive: req.body.moneyreceive,
          total_cost: totalcost,
          total_price: totalprice,
          total_freight: totalfreight,
          net: totalprice + totalfreight,
          platfrom: total_platfrom,
          status: {
            name: "รอการตรวจสอบราคา",
            timestamp: dayjs(Date.now()).format(""),
          },
          timestamp: dayjs(Date.now()).format(""),
        };

        const order = new OrderServiceModel(data);
        order.save(async (error, data) => {
          if (data) {
            const message = `
แจ้งงานเข้า : ${order.servicename}
เลขที่ทำรายการ : ${order.receiptnumber}
จาก : ${order.branch_name}
จำนวน : ${order.total_price} บาท
ตรวจสอบได้ที่ : http://shop-admin.nbadigitalservice.com/
            
*ฝากแอดมินรบกวนตรวจสอบด้วยนะคะ/ครับ* `;
            await line.linenotify(message);
            return res.status(200).send({
              status: true,
              data: data,
            });
          } else {
            console.error(error);
            return res.status(400).send({
              message: "ไม่สามารถบันทึกได้",
              error: error.message,
            });
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

module.exports.updatePictures = async (req, res) => {
  try {
    const id = req.params.id;

    let upload = multer({storage: storage}).array("imgCollection", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res
          .status(403)
          .send({message: "มีบางอย่างผิดพลาด", data: err.data});
      }

      const reqFiles = [];

      if (!req.files) {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          data: "No Request Files",
          status: false,
        });
      }

      const url = req.protocol + "://" + req.get("host");
      for (var i = 0; i < req.files.length; i++) {
        await uploadFileCreate(req.files, res, {i, reqFiles});
      }

      const orderService = await OrderServiceModel.findById(id);
      if (!orderService) {
        return res.status(404).send({message: "Order service not found"});
      }

      if (!orderService.picture) {
        orderService.picture = [];
      }

      const newPictures = orderService.picture.concat(reqFiles);

      OrderServiceModel.findByIdAndUpdate(
        id,
        {picture: newPictures},
        {returnDocument: "after"},
        (err, result) => {
          if (err) {
            return res
              .status(403)
              .send({message: "อัพเดทรูปภาพไม่สำเร็จ", data: err});
          }

          return res.status(200).send({
            message: "อัพเดทรูปภาพสำเร็จ",
            data: {
              picture: result.picture,
            },
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

module.exports.confirm = async (req, res) => {
  try {
    const updateStatus = await OrderServiceModel.findOne({_id: req.params.id});
    const status = updateStatus.status[0].name;
    if (status === "กำลังดำเนินการ") {
      return res
        .status(403)
        .send({message: "แอดมินได้ทำการคอนเฟิร์มออเดอร์นี้ไปแล้ว"});
    } else {
      if (updateStatus) {
        for (let item of updateStatus.product_detail) {
          const taxpackage = await TaxPackageModel.findOne({
            _id: item.packageid,
          });
          const service_free = await TaxCategoryModel.findOne({
            _id: taxpackage.categoryid,
          });
          let servicecharge = service_free.service_free;
          let reverse_price = 0;
          reverse_price = req.body.price + servicecharge;
          const data = {
            orderid: updateStatus._id,
            shopid: updateStatus.shopid,
            name: item.packagename,
            price: req.body.price,
            reverse_price: reverse_price,
            servicecharge: servicecharge,
            detail: req.body.detail,
            status: {
              name: "รอการตรวจสอบจากลูกค้า",
              timestamp: dayjs(Date.now()).format(""),
            },
          };
          const taxrevers = new TaxReverseModel(data);
          await taxrevers.save();
          updateStatus.status.push({
            name: "รอการตรวจสอบจากลูกค้า",
            timestamp: dayjs(Date.now()).format(""),
          });
          updateStatus.save();
        }
      } else {
        return res.status(403).send({message: "เกิดข้อผิดพลาด"});
      }
      return res.status(200).send({message: "คอนเฟิร์มออร์เดอร์สำเร็จ"});
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: "Internal Server", data: error});
  }
};

module.exports.ConfirmByCustomer = async (req, res) => {
  try {
    const checkuser = await Employee.findOne({_id: req.user._id});
    if (!checkuser) {
      return res.status(403).send({message: "User not found"});
    } else {
      const findshop = await Shop.findOne({_id: checkuser.employee_shop_id});
      if (!findshop) {
        return res.status(403).send({message: "Shop not found"});
      } else {
        // Find the taxreverse document by ID
        const taxreverse = await TaxReverseModel.findOne({_id: req.params.id});
        if (taxreverse.status[0].name === "ยืนยันจากลูกค้า") {
          return res.status(403).send({message: "ลูกค้าได้ทำการยืนยันไปแล้ว"});
        } else {
          if (!taxreverse) {
            return res
              .status(404)
              .send({message: "Tax reverse document not found"});
          } else {
            // Find and update the corresponding orderservice document
            const orderServiceToUpdate = await OrderServiceModel.findById(
              taxreverse.orderid
            );
            if (!orderServiceToUpdate) {
              return res
                .status(404)
                .send({message: "Order service document not found"});
            } else {
              for (let item of orderServiceToUpdate.product_detail) {
                item.price = taxreverse.price;
                item.cost = taxreverse.price;
                item.freight = taxreverse.servicecharge;
              }

              const totalprice = orderServiceToUpdate.product_detail.reduce(
                (accumulator, currentValue) => accumulator + currentValue.price,
                0
              );
              const totalfreight = orderServiceToUpdate.product_detail.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.freight,
                0
              );

              const totalcost = orderServiceToUpdate.product_detail.reduce(
                (accumulator, currentValue) => accumulator + currentValue.cost,
                0
              );

              const partner = await Partners.findById({
                _id: findshop.shop_partner_id,
              });

              // ตัดเงิน;
              const newwallet =
                partner.partner_wallet - (totalprice + totalfreight);
              await Partners.findByIdAndUpdate(partner._id, {
                partner_wallet: newwallet,
              });

              let platfrom = (totalfreight * 80) / 100;

              orderServiceToUpdate.total_cost = totalcost;
              orderServiceToUpdate.total_price = totalprice;
              orderServiceToUpdate.total_freight = totalfreight;
              orderServiceToUpdate.net = totalprice + totalfreight;
              orderServiceToUpdate.platfrom = platfrom;

              orderServiceToUpdate.status.push({
                name: "รอการตรวจสอบ",
                timestamp: dayjs(Date.now()).format(""),
              });

              taxreverse.status.push({
                name: "ยืนยันจากลูกค้า",
                timestamp: dayjs(Date.now()).format(""),
              });
              taxreverse.save();
              const getteammember = await getmemberteam.GetTeamMember(
                orderServiceToUpdate.customer_tel
              );
              if (!getteammember) {
                return res.status(403).send({message: "ไม่พบข้อมมูลลูกค้า"});
              } else {
                orderServiceToUpdate.save(async (error, data) => {
                  if (data) {
                    const findorderid = await OrderServiceModel.findById({
                      _id: data._id,
                    });

                    const code = "Service";
                    const percent = await Percent.findOne({code: code});

                    const platfromcommission = (platfrom * 80) / 100;
                    const bonus = (platfrom * 5) / 100;
                    const allSale = (platfrom * 15) / 100;

                    const level = getteammember.data;
                    const validLevel = level.filter((item) => item !== null);
                    const storeData = [];
                    const platform = percent.percent_platform;
                    //calculation from 80% for member
                    const owner =
                      (platfromcommission * platform.level_owner) / 100;
                    const lv1 = (platfromcommission * platform.level_one) / 100;
                    const lv2 = (platfromcommission * platform.level_two) / 100;
                    const lv3 =
                      (platfromcommission * platform.level_tree) / 100;

                    //calculation vat 3%
                    const ownervat = (owner * 3) / 100;
                    const lv1vat = (lv1 * 3) / 100;
                    const lv2vat = (lv2 * 3) / 100;
                    const lv3vat = (lv3 * 3) / 100;

                    const givecommission = {
                      invoice: orderServiceToUpdate.receiptnumber,
                      tel: orderServiceToUpdate.customer_tel,
                      platform: {
                        owner: owner,
                        lv1: lv1,
                        lv2: lv2,
                        lv3: lv3,
                      },
                      central: {
                        allsale: (allSale * 50) / 100,
                        central: (allSale * 50) / 100,
                      },
                      emp_bonus: bonus,
                    };

                    const give_commission = await getmemberteam.GiveCommission(
                      givecommission
                    );

                    if (give_commission.status === true) {
                      //real commission for member
                      const ownercommission = owner - ownervat; //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน
                      const lv1commission = lv1 - lv1vat; //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน
                      const lv2commission = lv2 - lv2vat; //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน
                      const lv3commission = lv3 - lv3vat; //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน

                      for (const TeamMemberData of validLevel) {
                        let integratedData;

                        if (TeamMemberData.level == "owner") {
                          integratedData = {
                            lv: TeamMemberData.level,
                            iden: TeamMemberData.iden,
                            name: TeamMemberData.name,
                            address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
                            tel: TeamMemberData.tel,
                            commission_amount: owner,
                            vat3percent: ownervat,
                            remainding_commission: ownercommission,
                          };
                        }
                        if (TeamMemberData.level == "1") {
                          integratedData = {
                            lv: TeamMemberData.level,
                            iden: TeamMemberData.iden,
                            name: TeamMemberData.name,
                            address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
                            tel: TeamMemberData.tel,
                            commission_amount: lv1,
                            vat3percent: lv1vat,
                            remainding_commission: lv1commission,
                          };
                        }
                        if (TeamMemberData.level == "2") {
                          integratedData = {
                            lv: TeamMemberData.level,
                            iden: TeamMemberData.iden,
                            name: TeamMemberData.name,
                            address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
                            tel: TeamMemberData.tel,
                            commission_amount: lv2,
                            vat3percent: lv2vat,
                            remainding_commission: lv2commission,
                          };
                        }
                        if (TeamMemberData.level == "3") {
                          integratedData = {
                            lv: TeamMemberData.level,
                            iden: TeamMemberData.iden,
                            name: TeamMemberData.name,
                            address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
                            tel: TeamMemberData.tel,
                            commission_amount: lv3,
                            vat3percent: lv2vat,
                            remainding_commission: lv3commission,
                          };
                        }
                        if (integratedData) {
                          storeData.push(integratedData);
                        }
                      }

                      const commissionData = {
                        data: storeData,
                        platformcommission: platfromcommission,
                        bonus: bonus,
                        allSale: allSale,
                        orderid: findorderid,
                        code: "Service",
                      };

                      const commission = new Commission(commissionData);
                      commission.save((error, data) => {
                        if (error) {
                          console.log(error);
                          return res.status(403).send({
                            status: false,
                            message: "ไม่สามารถบันทึกได้",
                          });
                        }
                        // Create wallet history
                        const wallethistory = {
                          shop_id: orderServiceToUpdate.shopid,
                          partner_id: partner._id,
                          orderid: orderServiceToUpdate._id,
                          name: `รายการสั่งซื้อ Tax Service(ภาษี) ใบเสร็จเลขที่ ${orderServiceToUpdate.receiptnumber}`,
                          type: "เงินออก",
                          before: partner.partner_wallet,
                          after: newwallet,
                          amount: orderServiceToUpdate.net,
                        };
                        const walletHistory = new WalletHistory(wallethistory);
                        walletHistory.save();
                      });
                      const message = `
แจ้งงานเข้า : ${orderServiceToUpdate.servicename}
เลขที่ทำรายการ : ${orderServiceToUpdate.receiptnumber}
จาก : ${orderServiceToUpdate.branch_name}
จำนวน : ${orderServiceToUpdate.net} บาท
ตรวจสอบได้ที่ : http://shop-admin.nbadigitalservice.com/
    
*ฝากแอดมินรบกวนตรวจสอบด้วยนะคะ/ครับ* `;
                      await line.linenotify(message);
                      return res.status(200).send({
                        status: true,
                        data: data,
                      });
                    } else {
                      return res.status(400).send({
                        message: "จ่ายค่าคอมมิชชั่นไม่สำเร็จ",
                        error: error.message,
                      });
                    }
                  } else {
                    console.error(error);
                    return res.status(400).send({
                      message: "ไม่สามารถบันทึกได้",
                      error: error.message,
                    });
                  }
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "Internal Server Error", data: error});
  }
};

module.exports.CancelByCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const findTaxReverse = await TaxReverseModel.findById(id);
    if (!findTaxReverse) {
      return res.status(403).send({message: "ไม่มีใบเสนอราคานี้อยู่แล้ว"});
    } else {
      const findOrder = await OrderServiceModel.findById(
        findTaxReverse.orderid
      );
      if (!findOrder) {
        return res.status(403).send({message: "ไม่มีออร์เดอร์นี้อยู่แล้ว"});
      } else {
        if (
          findTaxReverse.status === "ลูกค้ายกเลิกใบเสนอราคานี้" ||
          OrderServiceModel.status === "ถูกยกเลิก"
        ) {
          return res
            .status(403)
            .send({message: "ใบเสนอราคาและออร์เดอร์นี้ถูกยกเลิกไปแล้ว"});
        } else {
          await TaxReverseModel.findByIdAndUpdate(findTaxReverse._id, {
            status: "ลูกค้ายกเลิกใบเสนอราคานี้",
          });
          await OrderServiceModel.findByIdAndUpdate(findTaxReverse.orderid, {
            status: "ถูกยกเลิก",
          });
        }
        return res.status(200).send({message: "ยกเลิกใบเสนอราคาสำเร็จ"});
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: "Internal Server", data: error});
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

//update image
async function uploadFileCreate(req, res, {i, reqFiles}) {
  const filePath = req[i].path;
  let fileMetaData = {
    name: req.originalname,
    parents: [process.env.GOOGLE_DRIVE_IMAGE_ACT_SERVICE_ORDER],
  };
  let media = {
    body: fs.createReadStream(filePath),
  };
  try {
    const response = await drive.files.create({
      resource: fileMetaData,
      media: media,
    });

    generatePublicUrl(response.data.id);
    reqFiles.push(response.data.id);
  } catch (error) {
    res.status(500).send({message: "Internal Server Error"});
  }
}

async function generatePublicUrl(res) {
  console.log("generatePublicUrl");
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    console.log(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
}
