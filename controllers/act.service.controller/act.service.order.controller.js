const { ActPackageModel } = require('../../models/act.service.model/act.service.package.model')
const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')
const { Shop } = require('../../models/pos.models/shop.model')
const { Partners } = require('../../models/pos.models/partner.model')
const { Employee } = require('../../models/pos.models/employee.model')
const getmemberteam = require('../../lib/getPlateformMemberTeam')
const { Commission } = require('../../models/commission.model')
const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')
const multer = require('multer')
const fs = require('fs')
const { google } = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
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
    // const { error } = validate({...req.body,shopid:""});
    // if (error) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: error.details[0].message });
    // }
    const actpackage = await ActPackageModel.findOne({ _id: req.body.product_detail[0].packageid });
    console.log(actpackage);
    if (actpackage) {

      let token = req.headers['auth-token'];
      token = token.replace(/^Bearer\s+/, "");
      jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, decoded) => {
        if (err) {
          jwt.verify(token, process.env.API_PARTNER_KEY, async (err, partner_decoded) => {
            console.log(partner_decoded)
            if (err) {
              return res.status(403).send({ message: 'Not have permission ' })
            } else {
              const totalprice = actpackage.price * req.body.product_detail[0].quantity
              const change = req.body.moneyreceive - totalprice

              //generate receipt number
              const shop_partner_type = req.body.shop_partner_type
              const receiptnumber = await GenerateRiceiptNumber(shop_partner_type, req.body.shop_branch_id)

              // create order
              let data = {
                receiptnumber: receiptnumber,
                customer_contact: req.body.customer_contact,
                customer_name: req.body.customer_name,
                customer_tel: req.body.customer_tel,
                customer_address: req.body.customer_address,
                customer_iden_id: req.body.customer_iden_id,
                customer_line: req.body.customer_line,
                partnername: 'platform',
                servicename: 'Act of legislation Service(พรบ.)',
                shopid: req.body.shopid,
                shop_partner_type: req.body.shop_partner_type,
                branch_name: req.body.branch_name,
                branch_id: req.body.branch_id,
                product_detail: [{
                  packageid: actpackage._id,
                  packagename: actpackage.name,
                  packagedetail: actpackage.detail,
                  quantity: req.body.product_detail[0].quantity,
                  price: actpackage.price,
                }],
                paymenttype: req.body.paymenttype,
                moneyreceive: req.body.moneyreceive,
                totalCost: actpackage.cost + actpackage.nbaprofit,
                totalprice: totalprice,
                change: change
              }
              const order = new OrderServiceModel(data)
              order.save(error => {
                if (error) {
                  console.error(error)
                  return res.status(403).send({ message: 'ไม่สามารถบันทึกได้' })
                }
              })
              return res.status(200).send({ message: 'เพิ่มข้อมูลสำเร็จ', data: data })
            }
          })
        } else {
          const checkuser = await Employee.findOne({ _id: decoded._id });
          if (!checkuser) {
            return res.status(403).send({ message: 'ไม่พบข้อมูลผู้ใช้' })
          } else {
            //find shop
            const findshop = await Shop.findOne({ _id: checkuser.employee_shop_id });
            if (!findshop) {

              return res.status(400).send({ status: false, message: "ไม่พบ shop" });
            } else {
              const partner = await Partners.findById({ _id: findshop.shop_partner_id });
              //check partner wallet
              if (partner.partner_wallet < actpackage.price) {
                return res.status(400).send({ status: false, message: 'ยอดเงินไม่ในกระเป๋าไม่เพียงพอ' })
              } else {

                //getorder
                const orders = []
                let totalCost = 0
                for (let item of req.body.product_detail) {
                  const container = await ActPackageModel.findOne({ _id: item.packageid })
                  if (container) {
                    orders.push({
                      packageid: container._id,
                      packagename: container.name,
                      packagedetail: container.detail,
                      quantity: item.quantity,
                      plateformprofit: container.plateformprofit,
                      price: container.price,
                    })
                    totalCost += (container.cost + container.nbaprofit) * item.quantity
                  }
                }
                console.log('orders', orders);
                const totalprice = orders.reduce((accumulator, currentValue) => (accumulator) + (currentValue.price * currentValue.quantity), 0);
                const totalplateformprofit = orders.reduce((accumulator, currentValue) => (accumulator) + (currentValue.plateformprofit * currentValue.quantity), 0);

                // debitdata
                const debitData = [];
                if (req.body.debit && Array.isArray(req.body.debit)) {
                  for (const debitItem of req.body.debit) {
                    debitData.push({
                      debitname: debitItem.debitname,
                      debitnumber: debitItem.debitnumber,
                      debitamount: debitItem.debitamount,
                    });
                  }
                }

                // creditdata
                const creditData = [];
                if (req.body.credit && Array.isArray(req.body.credit)) {
                  for (const creditItem of req.body.credit) {
                    creditData.push({
                      creditname: creditItem.creditname,
                      creditnumber: creditItem.creditnumber,
                      creditamount: creditItem.creditamount,
                    });
                  }
                }

                //ตัดเงิน
                const price = totalprice
                const newwallet = partner.partner_wallet - price
                await Partners.findByIdAndUpdate(partner._id, { partner_wallet: newwallet });

                //generate recipt number
                const receiptnumber = await GenerateRiceiptNumber(findshop.shop_partner_type, findshop.shop_branch_id)

                //commission
                //calculation from 100%
                const commission = totalplateformprofit
                const platformCommission = (commission * 80) / 100
                const bonus = (commission * 5) / 100 //bonus
                const allSale = (commission * 15) / 100 //all sale

                //calculation from 80% for member
                const owner = (platformCommission * 55) / 100
                const lv1 = (platformCommission * 20) / 100
                const lv2 = (platformCommission * 15) / 100
                const lv3 = (platformCommission * 10) / 100

                //calculation vat 3%
                const ownervat = (owner * 3) / 100
                const lv1vat = (lv1 * 3) / 100
                const lv2vat = (lv2 * 3) / 100
                const lv3vat = (lv3 * 3) / 100

                //real commission for member
                const ownercommission = owner - ownervat //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน
                const lv1commission = lv1 - lv1vat //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน
                const lv2commission = lv2 - lv2vat //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน
                const lv3commission = lv3 - lv3vat //ใช้ค่านี้เพื่อจ่ายค่าคอมมิสชัน

                //คำนวนเงินทอน
                const change = req.body.moneyreceive - price

                //create order
                const data = {
                  receiptnumber: receiptnumber,
                  customer_contact: req.body.customer_contact,
                  customer_name: req.body.customer_name,
                  customer_tel: req.body.customer_tel,
                  customer_address: req.body.customer_address,
                  customer_iden_id: req.body.customer_iden_id,
                  customer_line: req.body.customer_line,
                  partnername: 'shop',
                  servicename: 'Act of legislation Service(พรบ.)',
                  shopid: findshop._id,
                  shop_partner_type: findshop.shop_partner_type,
                  branch_name: findshop.shop_name,
                  branch_id: findshop.shop_branch_id,
                  product_detail: orders,
                  debit: debitData,
                  credit: creditData,
                  paymenttype: req.body.paymenttype,
                  moneyreceive: req.body.moneyreceive,
                  totalCost: totalCost,
                  totalprice: price,
                  change: change
                }
                console.log(data)
                const order = new OrderServiceModel(data)
                const getteammember = await getmemberteam.GetTeamMember(req.body.customer_tel);

                if (getteammember.status === false) {

                  return res.status(403).send({ message: 'ไม่พบข้อมมูลลูกค้า' })

                } else {

                  order.save(async (error, data) => {

                    if (data) {
                      const findorderid = await OrderServiceModel.findById({ _id: data._id });

                      const level = getteammember.data;

                      const validLevel = level.filter(item => item !== null);

                      const storeData = [];

                      for (const TeamMemberData of validLevel) {
                        let integratedData;

                        if (TeamMemberData.level == 'owner') {
                          integratedData = {
                            lv: TeamMemberData.level,
                            iden: TeamMemberData.iden,
                            name: TeamMemberData.name,
                            address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
                            tel: TeamMemberData.tel,
                            commission_amount: owner,
                            vat3percent: ownervat,
                            remainding_commission: ownercommission
                          };
                        }
                        if (TeamMemberData.level == '1') {
                          integratedData = {
                            lv: TeamMemberData.level,
                            iden: TeamMemberData.iden,
                            name: TeamMemberData.name,
                            address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
                            tel: TeamMemberData.tel,
                            commission_amount: lv1,
                            vat3percent: lv1vat,
                            remainding_commission: lv1commission
                          };
                        }
                        if (TeamMemberData.level == '2') {
                          integratedData = {
                            lv: TeamMemberData.level,
                            iden: TeamMemberData.iden,
                            name: TeamMemberData.name,
                            address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
                            tel: TeamMemberData.tel,
                            commission_amount: lv2,
                            vat3percent: lv2vat,
                            remainding_commission: lv2commission
                          };
                        }
                        if (TeamMemberData.level == '3') {
                          integratedData = {
                            lv: TeamMemberData.level,
                            iden: TeamMemberData.iden,
                            name: TeamMemberData.name,
                            address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
                            tel: TeamMemberData.tel,
                            commission_amount: lv3,
                            vat3percent: lv2vat,
                            remainding_commission: lv3commission
                          };
                        }
                        if (integratedData) {
                          storeData.push(integratedData);
                        }
                      }

                      const commissionData = {
                        data: storeData,
                        platformcommission: platformCommission,
                        bonus: bonus,
                        allSale: allSale,
                        orderid: findorderid._id
                      };
                      const commission = new Commission(commissionData)
                      commission.save((error, data) => {
                        if (error) {
                          console.log(error)
                          return res.status(403).send({ message: 'ไม่สามารถบันทึกได้', data: data })
                        }
                      })
                      return res.status(200).send({ status: true, data: data, ยอดเงินคงเหลือ: newwallet });
                    } else {
                      console.error(error)
                      return res.status(400).send({ message: 'ไม่สามารถบันทึกได้', error: error.message })
                    }
                  })
                }
              }
            }
          }
        }

      })
    } else {
      return res
        .status(400)
        .send({ status: false, message: "ไม่พบบริการเซอร์วิสต์นี้" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
}

module.exports.updatePictures = async (req, res) => {
  try {
    const id = req.params.id;

    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(403).send({ message: 'มีบางอย่างผิดพลาด', data: err });
      }

      const reqFiles = [];

      if (!req.files) {
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด", data: 'No Request Files', status: false });
      }

      const url = req.protocol + "://" + req.get("host");
      for (var i = 0; i < req.files.length; i++) {
        await uploadFileCreate(req.files, res, { i, reqFiles });
      }

      const orderService = await OrderServiceModel.findById(id);
      if (!orderService) {
        return res.status(404).send({ message: 'Order service not found' });
      }

      if (!orderService.picture) {
        orderService.picture = [];
      }

      const newPictures = orderService.picture.concat(reqFiles);

      OrderServiceModel.findByIdAndUpdate(
        id,
        { picture: newPictures },
        { returnDocument: 'after' },
        (err, result) => {
          if (err) {
            return res.status(403).send({ message: 'อัพเดทรูปภาพไม่สำเร็จ', data: err });
          }

          return res.status(200).send({
            message: 'อัพเดทรูปภาพสำเร็จ',
            data: {
              picture: result.picture
            }
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

async function GenerateRiceiptNumber(shop_partner_type, branch_id) {
  if (shop_partner_type === 'One Stop Service') {
    const pipeline = [
      {
        $match: { shop_partner_type: shop_partner_type }
      },
      {
        $group: { _id: 0, count: { $sum: 1 } }
      }
    ];
    const count = await OrderServiceModel.aggregate(pipeline);
    const countValue = count.length > 0 ? count[0].count + 1 : 1;
    const data = `REP${dayjs(Date.now()).format('YYYYMMDD')}${countValue.toString().padStart(5, '0')}`;
    return data;
  } else {
    const pipeline = [
      {
        $match: {
          $and: [
            { "shop_partner_type": shop_partner_type },
            { "branch_id": branch_id }
          ]
        }
      },
      {
        $group: { _id: 0, count: { $sum: 1 } }
      }
    ];
    const count = await OrderServiceModel.aggregate(pipeline);
    const countValue = count.length > 0 ? count[0].count + 1 : 1;
    const data = `RE${dayjs(Date.now()).format('YYYYMMDD')}${countValue.toString().padStart(5, '0')}`;
    console.log(count);
    return data;
  }
}

//update image
async function uploadFileCreate(req, res, { i, reqFiles }) {
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
    res.status(500).send({ message: "Internal Server Error" });
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
    return res.status(500).send({ message: "Internal Server Error" });
  }
}