const { FacebookPackage } = require('../../models/facebook.model/facebook.package.model')
const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')
const { Shop } = require('../../models/pos.models/shop.model')
const { Partners } = require('../../models/pos.models/partner.model')
const { Employee } = require('../../models/pos.models/employee.model')
const jwt = require('jsonwebtoken')

module.exports.order = async (req, res) => {

  try {
    const { error } = validate({...req.body,shopid:""});
    if (error) {
      return res
        .status(400)
        .send({ status: false, message: error.details[0].message });
    }
    const facebookpackage = await FacebookPackage.findOne({ _id: req.body.packageid });
    console.log(facebookpackage);
    if (facebookpackage) {
      let token = req.headers['auth-token'];
      console.log('token', token)
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
                partnername: 'platform',
                servicename: 'Facebook Service',
                shopid: req.body.shopid,
                packageid: facebookpackage._id,
                quantity: req.body.quantity,
                price: facebookpackage.price,
                totalprice: facebookpackage.price * req.body.quantity
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
              if (partner.partner_wallet < facebookpackage.price) {
                return res.status(400).send({ status: false, message: 'ยอดเงินไม่ในกระเป๋าไม่เพียงพอ' })
              } else {
                //ตัดเงิน
                const price = facebookpackage.price * req.body.quantity
                const newwallet = partner.partner_wallet - price
                await Partners.findByIdAndUpdate(partner._id, { partner_wallet: newwallet });

                //create order
                const data = {
                  customer_name: req.body.customer_name,
                  customer_tel: req.body.customer_tel,
                  customer_address: req.body.customer_address,
                  partnername: 'shop',
                  servicename: 'Facebook Service',
                  shopid: findshop._id,
                  packageid: facebookpackage._id,
                  quantity: req.body.quantity,
                  price: facebookpackage.price,
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