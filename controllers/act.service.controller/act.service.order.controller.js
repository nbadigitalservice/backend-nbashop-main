const { ActPackageModel } = require('../../models/act.service.model/act.service.package.model')
const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')
const { Shop } = require('../../models/pos.models/shop.model')
const { Partners } = require('../../models/pos.models/partner.model')
const { Employee } = require('../../models/pos.models/employee.model')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

module.exports.order = async (req, res) => {

    const vali = (data) => {
        const schema = Joi.object({
          packageid: Joi.string().required().label("ไม่มีข้อมูลแพ็คเกจไอดี"),
          quantity: Joi.number().required().label("ไม่พบจำนวนของสินค้า"),
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
        const actpackage = await ActPackageModel.findOne({ _id: req.body.packageid });
        console.log(actpackage);
        if (actpackage) {

            let token = req.headers['auth-token'];
            token = token.replace(/^Bearer\s+/, "");
            const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)

            const checkuser = await Employee.findOne({ _id: decoded._id });
            if (!checkuser) {
                // create order
                const data ={
                    partnername: 'platform',
                    servicename: 'Act of legislation Service(พรบ. ภาษี ประกัน)',
                    shopid: decoded._id,
                    packageid: actpackage._id,
                    quantity: req.body.quantity,
                    price: actpackage.price,
                    totalprice: actpackage.price * req.body.quantity
                }
                const order = new OrderServiceModel(data)
                      order.save(error => {
                        console.error(error)
                      })
            } else {

                //find shop
                const findshop = await Shop.findOne({ _id: checkuser.employee_shop_id });
                if (!findshop) {
                 
                    return res.status(400).send({status: false, message: "ไม่พบ shop"});
                } else {
                    const partner = await Partners.findById({ _id: findshop.shop_partner_id })
                    //check partner wallet
                    if(partner.partner_wallet < actpackage.price){
                        return res.status(400).send({status: false, message: 'ยอดเงินไม่ในกระเป๋าไม่เพียงพอ'})
                      } else {

                        //ตัดเงิน
                        const price = actpackage.price * req.body.quantity
                        const newwallet = partner.partner_wallet - price
                        await Partners.findByIdAndUpdate(partner._id, {partner_wallet: newwallet });

                        //create order
                        const data ={
                            partnername: 'shop',
                            servicename: 'Act of legislation Service(พรบ. ภาษี ประกัน)',
                            shopid: findshop._id,
                            packageid: actpackage._id,
                            quantity: req.body.quantity,
                            price: actpackage.price,
                            totalprice: price
                        }
        
                        const order = new OrderServiceModel(data)
                              order.save((error,data) => {
                                if(error){
                                    console.error(error)
                                }
                                return res.status(200).send({status: true, data:data, ยอดเงินคงเหลือ: newwallet});
                              })
                      }
                }
            } 
    
          
        } else {
          return res
            .status(400)
            .send({status: false, message: "ไม่พบบริการเซอร์วิสต์นี้"});
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
      }
}