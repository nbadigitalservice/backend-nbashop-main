const { TaxPackageModel } = require('../../models/tax.service.model/tax.service.package.model')
const { TaxReverseModel } = require('../../models/tax.service.model/tax.service.reverse.model')
const { OrderServiceModel, validate } = require('../../models/order.service.model/order.service.model')
const { WalletHistory } = require('../../models/wallet.history.model')
const { Shop } = require('../../models/pos.models/shop.model')
const { Partners } = require('../../models/pos.models/partner.model')
const { Employee } = require('../../models/pos.models/employee.model')
const getmemberteam = require('../../lib/getPlateformMemberTeam')
const { Commission } = require('../../models/commission.model')
const axios = require('axios');
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
        const taxpackage = await TaxPackageModel.findOne({ _id: req.body.product_detail[0].packageid });
        console.log(taxpackage);
        if (taxpackage) {

            let token = req.headers['auth-token'];
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, decoded) => {
                if (err) {
                    jwt.verify(token, process.env.API_PARTNER_KEY, async (err, partner_decoded) => {
                        if (err) {
                            return res.status(403).send({ message: 'Not have permission ' })
                        } else {
                            const totalprice = taxpackage.price * req.body.product_detail[0].quantity
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
                                servicename: 'Tax Service(ภาษี)',
                                shopid: req.body.shopid,
                                shop_partner_type: req.body.shop_partner_type,
                                branch_name: req.body.branch_name,
                                branch_id: req.body.branch_id,
                                product_detail: [{
                                    packageid: taxpackage._id,
                                    packagename: taxpackage.name,
                                    packagedetail: taxpackage.detail,
                                    quantity: req.body.product_detail[0].quantity,
                                    price: taxpackage.price,
                                }],
                                paymenttype: req.body.paymenttype,
                                moneyreceive: req.body.moneyreceive,
                                totalCost: taxpackage.cost + taxpackage.nbaprofit,
                                totalprice: totalprice,
                                change: change
                            }
                            const order = new OrderServiceModel(data)
                            await order.save(err => {
                                if (err) {
                                    console.error(err)
                                    return res.status(403).send({ message: 'ไม่สามารถบันทึกได้', data: err })
                                } else {
                                    return res.status(200).send({ message: 'บันทึกข้อมูลสำเร็จ', data: order })
                                }
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
                            if (partner.partner_wallet < taxpackage.price) {
                                return res.status(400).send({ status: false, message: 'ยอดเงินไม่ในกระเป๋าไม่เพียงพอ' })
                            } else {

                                //getorder
                                const orders = []
                                let totalCost = 0
                                for (let item of req.body.product_detail) {
                                    const container = await TaxPackageModel.findOne({ _id: item.packageid })
                                    if (container) {
                                        orders.push({
                                            packageid: container._id,
                                            packagename: container.name,
                                            packagedetail: container.detail,
                                            quantity: item.quantity,
                                            plateformprofit: container.plateformprofit,
                                            price: container.price,
                                            productcost: container.cost + container.nbaprofit
                                        })
                                        totalCost += (container.cost + container.nbaprofit) * item.quantity
                                    }
                                }

                                const totalprice = orders.reduce((accumulator, currentValue) => (accumulator) + (currentValue.price * currentValue.quantity), 0);

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
                                // const newwallet = partner.partner_wallet - price
                                // await Partners.findByIdAndUpdate(partner._id, { partner_wallet: newwallet });

                                //generate recipt number
                                const receiptnumber = await GenerateRiceiptNumber(findshop.shop_partner_type, findshop.shop_branch_id)

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
                                    servicename: 'Tax Service(ภาษี)',
                                    shopid: findshop._id,
                                    shop_partner_type: findshop.shop_partner_type,
                                    branch_name: findshop.shop_name,
                                    branch_id: findshop.shop_branch_id,
                                    product_detail: orders,
                                    debit: debitData,
                                    credit: creditData,
                                    paymenttype: req.body.paymenttype,
                                    moneyreceive: 0,
                                    totalCost: totalCost,
                                    totalprice: price,
                                    change: change
                                }
                                console.log(data)
                                const order = new OrderServiceModel(data)
                                await order.save(err => {
                                    if (err) {
                                        console.log(err)
                                        return res.status(403).send({ message: 'ไม่สมรถบันทึกได้', data: err })
                                    } else {
                                        return res.status(200).send({ message: 'บันทึกสำเร็จ', data: order })
                                    }
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

module.exports.updatePictures = async (req, res) => {
    try {
        const id = req.params.id;

        let upload = multer({ storage: storage }).array("imgCollection", 20);
        upload(req, res, async function (err) {
            if (err) {
                return res.status(403).send({ message: 'มีบางอย่างผิดพลาด', data: err.data });
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

module.exports.confirm = async (req, res) => {
    try {
        const updateStatus = await OrderServiceModel.findOne({ _id: req.params.id })

        if (updateStatus.status === "กำลังดำเนินการ") {
            return res.status(403).send({ message: 'แอดมินได้ทำการคอนเฟิร์มออเดอร์นี้ไปแล้ว' })
        }

        if (updateStatus) {
            const taxpackage = await TaxPackageModel.findById(updateStatus.product_detail[0].packageid)
            let servicecharge = 0
            if (taxpackage.categoryid === "รถจักรยานยนต์") {
                servicecharge = 50
            } else {
                servicecharge = 100
            }
            let reverse_price = 0
            reverse_price = req.body.price + req.body.tax_value + req.body.tax_mulct_value + req.body.traffic_mulct_value + req.body.other + servicecharge
            const data = {
                orderid: updateStatus._id,
                shopid: updateStatus.shopid,
                name: updateStatus.product_detail[0].packagename,
                price: req.body.price,
                reverse_price: reverse_price,
                servicecharge: servicecharge,
                tax_value: req.body.tax_value,
                tax_mulct_value: req.body.tax_mulct_value,
                traffic_mulct_value: req.body.traffic_mulct_value,
                other: req.body.other
            }
            const taxrevers = new TaxReverseModel(data)
            await taxrevers.save()
            await OrderServiceModel.findByIdAndUpdate(updateStatus._id, { status: 'กำลังดำเนินการ' })
        } else {
            return res.status(403).send({ message: 'เกิดข้อผิดพลาด' })
        } return res.status(200).send({ message: 'คอนเฟิร์มออร์เดอร์สำเร็จ' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error })
    }
}

module.exports.ConfirmByCustomer = async (req, res) => {
    try {
        // Find the taxreverse document by ID
        const taxreverse = await TaxReverseModel.findById(req.params.id);

        if (taxreverse.status === "ลูกค้ายืนยันแล้ว") {
            return res.status(403).send({ message: 'ลูกค้าได้ทำการยืนยันไปแล้ว' })
        }

        if (!taxreverse) {
            return res.status(404).send({ message: 'Tax reverse document not found' });
        }

        // Calculate the new price based on tax values and other fields
        let price = 0;
        price += taxreverse.price + (taxreverse.tax_value || 0) + (taxreverse.tax_mulct_value || 0) + (taxreverse.traffic_mulct_value || 0) + (taxreverse.other || 0);

        // Calculate the new totalprice (if needed)
        const totalprice = taxreverse.reverse_price;

        // Find and update the corresponding orderservice document
        const orderServiceIdToUpdate = taxreverse.orderid;
        const orderServiceToUpdate = await OrderServiceModel.findById(orderServiceIdToUpdate);

        if (!orderServiceToUpdate) {
            return res.status(404).send({ message: 'Order service document not found' });
        }

        orderServiceToUpdate.product_detail[0].price = price;
        orderServiceToUpdate.totalCost = price;
        orderServiceToUpdate.totalprice = totalprice;

        // Deduct money from wallet
        if (orderServiceToUpdate.partnername === "platform") {
            let tel = orderServiceToUpdate.customer_tel
            let data = {
                servicename: orderServiceToUpdate.servicename,
                receiptnumber: orderServiceToUpdate.receiptnumber,
                totalprice: orderServiceToUpdate.totalprice
            }
            const request = {
                method: 'post',
                headers: {
                  'token': process.env.NBA_PLATFORM_PUBLIC_KEY,
                  'Content-Type': 'application/json'
                },
                url: `${process.env.NBA_PLATFORM}member/confirm`,
                data: { tel: tel, data: data }
              }
              try {
                const response = await axios(request)
                if (response) {
                  // create wallet history
                  const wallethistory = {
                    shop_id: orderServiceToUpdate.shopid,
                    partner_id: 'platform',
                    orderid: orderServiceToUpdate._id,
                    name: `รายการสั่งซื้อ ${orderServiceToUpdate.servicename} ใบเสร็จเลขที่ ${orderServiceToUpdate.receiptnumber}`,
                    type: 'เงินออก',
                    amount: totalprice,
                  }
                  const walletHistory = new WalletHistory(wallethistory)
                  walletHistory.save()
                }
              } catch (error) {
                console.log(error)
                return res.status(400).send({ message: 'มีบางอย่างผิดพลาด', data: error.message })
              }
        } else {
            const findShop = await Shop.findOne({ _id: orderServiceToUpdate.shopid })
            const partner = await Partners.findOne({ _id: findShop.shop_partner_id });
            const newWallet = partner.partner_wallet - totalprice;
            await Partners.findByIdAndUpdate(partner._id, { partner_wallet: newWallet });

            // Create wallet history
            const wallethistory = {
                shop_id: orderServiceToUpdate.shopid,
                partner_id: partner._id,
                orderid: orderServiceToUpdate._id,
                name: `รายการสั่งซื้อ Tax Service(ภาษี) ใบเสร็จเลขที่ ${orderServiceToUpdate.receiptnumber}`,
                type: 'เงินออก',
                amount: totalprice,
            };

            const walletHistory = new WalletHistory(wallethistory);
            await walletHistory.save();
        }
        
        // Calculate commissions
        let taxcal = taxreverse.servicecharge
        if (taxcal == 50) {
            taxcal -= 10
        } else {
            taxcal -= 20
        }
        const commission = taxcal;
        const platformCommission = (commission * 80) / 100;
        const bonus = (commission * 5) / 100;
        const allSale = (commission * 15) / 100;

        const owner = (platformCommission * 55) / 100;
        const lv1 = (platformCommission * 20) / 100;
        const lv2 = (platformCommission * 15) / 100;
        const lv3 = (platformCommission * 10) / 100;

        const ownervat = (owner * 3) / 100;
        const lv1vat = (lv1 * 3) / 100;
        const lv2vat = (lv2 * 3) / 100;
        const lv3vat = (lv3 * 3) / 100;

        const ownerCommission = owner - ownervat;
        const lv1commission = lv1 - lv1vat;
        const lv2commission = lv2 - lv2vat;
        const lv3commission = lv3 - lv3vat;

        // Calculate and store commission data
        const getteammember = await getmemberteam.GetTeamMember(orderServiceToUpdate.customer_tel);
        if (!getteammember) {
            return res.status(403).send({ message: 'No customer data found' });
        }

        const validLevel = getteammember.data.filter(item => item !== null);
        const storeData = [];

        for (const TeamMemberData of validLevel) {
            let integratedData;

            if (TeamMemberData.level === 'owner') {
                integratedData = {
                    lv: TeamMemberData.level,
                    iden: TeamMemberData.iden,
                    name: TeamMemberData.name,
                    address: `${TeamMemberData.address.address}${TeamMemberData.address.subdistrict}${TeamMemberData.address.district}${TeamMemberData.address.province}${TeamMemberData.address.postcode}`,
                    tel: TeamMemberData.tel,
                    commission_amount: owner,
                    vat3percent: ownervat,
                    remainding_commission: ownerCommission,
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
            orderid: orderServiceToUpdate._id,
        };

        // Create and save commission data
        const givecommission = new Commission(commissionData);
        await givecommission.save();

        // Save the updated orderservice document
        await orderServiceToUpdate.save();
        await TaxReverseModel.findByIdAndUpdate(taxreverse._id, { status: 'ลูกค้ายืนยันแล้ว' })

        return res.status(200).send({ message: 'Order service document updated successfully', data: orderServiceToUpdate });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal Server Error', data: error });
    }
};

module.exports.CancelByCustomer = async (req, res) => {
    try {
        const id = req.params.id
        const findTaxReverse = await TaxReverseModel.findById(id)
        if (!findTaxReverse) {
            return res.status(403).send({ message: 'ไม่มีใบเสนอราคานี้อยู่แล้ว' })
        } else {
            const findOrder = await OrderServiceModel.findById(findTaxReverse.orderid)
            if (!findOrder) {
                return res.status(403).send({ message: 'ไม่มีออร์เดอร์นี้อยู่แล้ว' })
            } else {
                if (findTaxReverse.status === "ลูกค้ายกเลิกใบเสนอราคานี้" ||
                    OrderServiceModel.status === "ถูกยกเลิก") {
                    return res.status(403).send({ message: 'ใบเสนอราคาและออร์เดอร์นี้ถูกยกเลิกไปแล้ว' })
                } else {
                    await TaxReverseModel.findByIdAndUpdate(findTaxReverse._id, { status: 'ลูกค้ายกเลิกใบเสนอราคานี้' })
                    await OrderServiceModel.findByIdAndUpdate(findTaxReverse.orderid, { status: 'ถูกยกเลิก' })
                }
                return res.status(200).send({ message: 'ยกเลิกใบเสนอราคาสำเร็จ' })
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error })
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