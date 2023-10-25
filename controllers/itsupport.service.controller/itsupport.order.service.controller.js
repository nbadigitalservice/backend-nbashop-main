const { ItsupportPackage } = require('../../models/itsupport.model/itsupport.package.model')
const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')
const { WalletHistory } = require('../../models/wallet.history.model')
const line = require('../../lib/line.notify.order')
const { Shop } = require('../../models/pos.models/shop.model')
const { Partners } = require('../../models/pos.models/partner.model')
const { Employee } = require('../../models/pos.models/employee.model')
const getmemberteam = require('../../lib/getPlateformMemberTeam')
const { Commission } = require('../../models/commission.model')
const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')

module.exports.order = async (req, res) => {

  try {
    // const { error } = validate({...req.body,shopid:""});
    // if (error) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: error.details[0].message });
    // }
    const itsupportpackage = await ItsupportPackage.findOne({ _id: req.body.product_detail[0].packageid });
    console.log(itsupportpackage);
    if (itsupportpackage) {
      let token = req.headers['auth-token'];
      console.log('token', token)
      token = token.replace(/^Bearer\s+/, "");
      console.log
      jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, decoded) => {
        console.log(decoded)
        if (err) {
          jwt.verify(token, process.env.API_PARTNER_KEY, async (err, partner_decoded) => {
            console.log(partner_decoded)
            if (err) {
              return res.status(403).send({ message: 'Not have permission ' })
            } else {
              const totalprice = itsupportpackage.price * req.body.product_detail[0].quantity
              const change = req.body.moneyreceive - totalprice
              const totalplateformprofit = itsupportpackage.plateformprofit * req.body.product_detail[0].quantity

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
                servicename: 'IT Support Service',
                shopid: req.body.shopid,
                shop_partner_type: req.body.shop_partner_type,
                branch_name: req.body.branch_name,
                branch_id: req.body.branch_id,
                product_detail: [{
                  packageid: itsupportpackage._id,
                  packagename: itsupportpackage.name,
                  packagedetail: itsupportpackage.detail,
                  quantity: req.body.product_detail[0].quantity,
                  price: itsupportpackage.price,
                }],
                paymenttype: req.body.paymenttype,
                moneyreceive: req.body.moneyreceive,
                totalCost: itsupportpackage.cost + itsupportpackage.nbaprofit,
                totalprice: totalprice,
                change: change,
                status: ({
                  name: 'รอการตรวจสอบ',
                  timestamp: dayjs(Date.now()).format(''),
                }),
              }
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
                      orderid: receiptnumber,
                      code: "Service"
                    };
                    const commission = new Commission(commissionData)
                    commission.save((error, data) => {
                      if (error) {
                        console.log(error)
                        return res.status(403).send({ message: 'ไม่สามารถบันทึกได้', data: data })
                      }

                      // create wallet history
                      const wallethistory = {
                        shop_id: order.shopid,
                        partner_id: 'platform',
                        orderid: order._id,
                        name: `รายการสั่งซื้อ IT Support Service ใบเสร็จเลขที่ ${order.receiptnumber}`,
                        type: 'เงินออก',
                        amount: order.totalprice,
                      }
                      const walletHistory = new WalletHistory(wallethistory)
                      walletHistory.save()
                    });
                    const message = `
แจ้งงานเข้า : ${order.servicename}
เลขที่ทำรายการ : ${order.receiptnumber}
จาก : ${order.branch_name}
จำนวน : ${order.totalprice} บาท
สถานะ : ${order.status}
ตรวจสอบได้ที่ : http://shop-admin.nbadigitalservice.com/

*ตั้งใจทำงานการนะคะ/ครับ* `
                    await line.linenotify(message);
                    return res.status(200).send({ status: true, data: order});
                  } else {
                    console.error(error)
                    return res.status(400).send({ message: 'ไม่สามารถบันทึกได้', error: error.message })
                  }
                })
              }
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
              if (partner.partner_wallet < itsupportpackage.price) {
                return res.status(400).send({ status: false, message: 'ยอดเงินไม่ในกระเป๋าไม่เพียงพอ' })
              } else {

                //getorder
                const orders = []
                let totalCost = 0
                for (let item of req.body.product_detail) {
                  const container = await ItsupportPackage.findOne({ _id: item.packageid })
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
                  servicename: 'IT Support Service',
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
                  change: change,
                  status: ({
                    name: 'รอการตรวจสอบ',
                    timestamp: dayjs(Date.now()).format(''),
                  }),
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
                        orderid: receiptnumber,
                        code: "Service"
                      };
                      const commission = new Commission(commissionData)
                      commission.save((error, data) => {
                        if (error) {
                          console.log(error)
                          return res.status(403).send({ message: 'ไม่สามารถบันทึกได้', data: data })
                        }
                        // create wallet history
                        const wallethistory = {
                          shop_id: findshop._id,
                          partner_id: partner._id,
                          orderid: findorderid._id,
                          name: `รายการสั่งซื้อ IT Support Service ใบเสร็จเลขที่ ${findorderid.receiptnumber}`,
                          type: 'เงินออก',
                          amount: findorderid.totalprice,
                        }
                        const walletHistory = new WalletHistory(wallethistory)
                        walletHistory.save()
                      });
                      const message = `
แจ้งงานเข้า : ${order.servicename}
เลขที่ทำรายการ : ${order.receiptnumber}
จาก : ${order.branch_name}
จำนวน : ${order.totalprice} บาท
สถานะ : ${order.status}
ตรวจสอบได้ที่ : http://shop-admin.nbadigitalservice.com/

*ตั้งใจทำงานการนะคะ/ครับ* `
                    await line.linenotify(message);
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