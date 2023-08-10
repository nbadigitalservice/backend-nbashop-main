const { WebsitePackageModel } = require('../../models/website.package.model/website.package.model')
const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')
const { Shop } = require('../../models/pos.models/shop.model')
const { Partners } = require('../../models/pos.models/partner.model')
const { Employee } = require('../../models/pos.models/employee.model')
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
    const websitepackage = await WebsitePackageModel.findOne({ _id: req.body.product_detail[0].packageid });
    console.log(websitepackage);
    if (websitepackage) {
      let token = req.headers['auth-token'];
      console.log(token)
      token = token.replace(/^Bearer\s+/, "");
      jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, decoded) => {
        if (err) {
          jwt.verify(token, process.env.API_PARTNER_KEY, (err, partner_decoded) => {
            console.log(partner_decoded)
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
                servicename: 'Website Service',
                shopid: req.body.shopid,
                shop_partner_type: req.body.shop_partner_type,
                product_detail: [{
                  packageid: websitepackage._id,
                  quantity: req.body.product_detail[0].quantity,
                  price: websitepackage.price,
                }],
                totalprice: websitepackage.price * req.body.product_detail[0].quantity
              }
              const order = new OrderServiceModel(data)
              order.save(error => {
                if (error) {
                  console.error(error)
                  return res.status(403).send({ message: 'ไม่สามารถบันทึกได้'})
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
            console.log(findshop)
            if (!findshop) {

              return res.status(400).send({ status: false, message: "ไม่พบ shop" });
            } else {
              const partner = await Partners.findById({ _id: findshop.shop_partner_id });
              //check partner wallet
              if (partner.partner_wallet < websitepackage.price) {
                return res.status(400).send({ status: false, message: 'ยอดเงินไม่ในกระเป๋าไม่เพียงพอ' })
              } else {

                //getorder
                const orders = []
                for (let item of req.body.product_detail) {
                  const container = await WebsitePackageModel.findOne({ _id: item.packageid })
                  if (container) {
                    orders.push({
                      packageid: container._id,
                      quantity: item.quantity,
                      price: container.price,
                    })
                  }
                }
                console.log('orders', orders);
                const totalprice = orders.reduce((accumulator, currentValue) => (accumulator) + (currentValue.price * currentValue.quantity), 0);

                //ตัดเงิน
                const price = totalprice
                const newwallet = partner.partner_wallet - price
                await Partners.findByIdAndUpdate(partner._id, { partner_wallet: newwallet });

                //generate recipt number
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
                  const data = `RE${dayjs(Date.now()).format('YYYYMMDD')}${countValue.toString().padStart(5,'0')}`;
                  console.log(count)
                  return data
                }

                //create order
                const data = {
                  receiptnumber: receiptnumber,
                  customer_name: req.body.customer_name,
                  customer_tel: req.body.customer_tel,
                  customer_address: req.body.customer_address,
                  customer_iden_id: req.body.customer_iden_id,
                  customer_line: req.body.customer_line,
                  partnername: 'shop',
                  servicename: 'Website Service',
                  shopid: findshop._id,
                  shop_partner_type: findshop.shop_partner_type,
                  branch_name: findshop.shop_name,
                  branch_id: findshop.shop_branch_id,
                  product_detail: orders,
                  totalprice: price
                }
                console.log(data)
                const order = new OrderServiceModel(data)
                order.save((error, data) => {
                  if (error) {
                    console.error(error)
                    return res.status(400).send({ message: 'ไม่สามารถบันทึกได้', error: error.message })
                  }
                  return res.status(200).send({ status: true, data: data, ยอดเงินคงเหลือ: newwallet });
                })
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
  const data = `RE${dayjs(Date.now()).format('YYYYMMDD')}${countValue.toString().padStart(5,'0')}`;
  console.log(count)
  return data
}