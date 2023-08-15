const { FacebookPackage } = require('../../models/facebook.model/facebook.package.model')
const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')
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
    const facebookpackage = await FacebookPackage.findOne({ _id: req.body.product_detail[0].packageid });
    if (facebookpackage) {
      let token = req.headers['auth-token'];
      token = token.replace(/^Bearer\s+/, "");
      jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, decoded) => {
        if (err) {
          jwt.verify(token, process.env.API_PARTNER_KEY, (err, partner_decoded) => {
            if (err) {
              return res.status(403).send({ message: 'Not have permission ' })
            } else {
              // create order
              let data = {
                customer_name: req.body.customer_name,
                customer_tel: req.body.customer_tel,
                customer_address: req.body.customer_address,
                customer_iden_id: req.body.customer_iden_id,
                customer_line: req.body.customer_line,
                partnername: 'platform',
                servicename: 'Facebook Service',
                shopid: req.body.shopid,
                shop_partner_type: req.body.shop_partner_type,
                product_detail: [{
                  packageid: facebookpackage._id,
                  packagename: facebookpackage.name,
                  packagedetail: facebookpackage.detail,
                  quantity: req.body.product_detail[0].quantity,
                  price: facebookpackage.price,
                }],
                totalprice: facebookpackage.price * req.body.product_detail[0].quantity
              }
              const order = new OrderServiceModel(data)
              order.save(error => {
                if (error) {
                  console.error(error)
                  return res.status(403).send({ message: 'ไม่สามารถบันทึกได้' })
                }
                return res.status(200).send({ message: 'เพิ่มข้อมูลสำเร็จ', data: data })
              })

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
              if (partner.partner_wallet < facebookpackage.price) {
                return res.status(400).send({ status: false, message: 'ยอดเงินไม่ในกระเป๋าไม่เพียงพอ' })
              } else {

                //getorder
                const orders = []

                for (let item of req.body.product_detail) {
                  const container = await FacebookPackage.findOne({ _id: item.packageid })
                  if (container) {
                    orders.push({
                      packageid: container._id,
                      packagename: container.name,
                      packagedetail: container.detail,
                      quantity: item.quantity,
                      plateformprofit: container.plateformprofit,
                      price: container.price,
                    })
                  }
                }
                const totalprice = orders.reduce((accumulator, currentValue) => (accumulator) + (currentValue.price * currentValue.quantity), 0);
                const totalplateformprofit = orders.reduce((accumulator, currentValue) => (accumulator) + (currentValue.plateformprofit * currentValue.quantity), 0);


                //ตัดเงิน
                const price = totalprice
                const newwallet = partner.partner_wallet - price
                await Partners.findByIdAndUpdate(partner._id, { partner_wallet: newwallet });

                //generate receipt number
                const receiptnumber = await GenerateRiceiptNumber(findshop.shop_partner_type, findshop.shop_branch_id)
                if (findshop.shop_partner_type && receiptnumber == 'One Stop Service') {
                  const pipeline = [
                    {
                      $match: { shop_partner_type: shop_partner_type }
                    },
                    {
                      $group: { _id: 0, count: { $sum: 1 } }
                    }
                  ]
                  const count = await OrderServiceModel.aggregate(pipeline);
                  const countValue = count.length > 0 ? count[0].count + 1 : 1
                  const data = `RE${dayjs(Date.now()).format('YYYYMMDD')}${countValue.toString().padStart(5, '0')}`;
                  return data
                }

                //commission
                //total profit

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

                const data = {
                  receiptnumber: receiptnumber,
                  customer_name: req.body.customer_name,
                  customer_tel: req.body.customer_tel,
                  customer_address: req.body.customer_address,
                  customer_iden_id: req.body.customer_iden_id,
                  customer_line: req.body.customer_line,
                  partnername: 'shop',
                  servicename: 'Facebook Service',
                  shopid: findshop._id,
                  shop_partner_type: findshop.shop_partner_type,
                  branch_name: findshop.shop_name,
                  branch_id: findshop.shop_branch_id,
                  product_detail: orders,
                  totalprice: price
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

async function GenerateRiceiptNumber(shop_partner_type, branch_id) {
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
  ]
  const count = await OrderServiceModel.aggregate(pipeline);
  const countValue = count.length > 0 ? count[0].count + 1 : 1
  const data = `RE${dayjs(Date.now()).format('YYYYMMDD')}${countValue.toString().padStart(5, '0')}`;
  console.log(count)
  return data
}