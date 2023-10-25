const mongoose = require("mongoose");
const {Commission} = require("../models/commission.model");
const {
  OrderServiceModel,
} = require("../models/order.service.model/order.service.model");
const {
  ExchangeHistory,
} = require("../models/exchangepoint.model/exchangehistory.model");
const {Partners} = require("../models/pos.models/partner.model");

module.exports.GetCommissionByTel = async (req, res) => {
  try {
    console.log(req.user);
    let tel = req.user.partner_phone;
    if (req.user.partner_name === "NBA_PLATEFORM") {
      tel = req.body.tel;
    }
    const pipeline = [
      {
        $unwind: "$data",
      },
      {
        $match: {"data.tel": tel},
      },
      {
        $group: {
          _id: "$data.tel",
          totalRemainingCommission: {$sum: "$data.remainding_commission"},
        },
      },
      {
        $project: {
          _id: 0,
          tel: "$_id",
          totalRemainingCommission: 1,
        },
      },
    ];

    const result = await Commission.aggregate(pipeline);

    return res.status(200).send({message: "ดึงข้อมูลสำเร็จ", data: result});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({message: "เกิดข้อผิดพลาดบางอย่าง", data: error.data});
  }
};

module.exports.GetUnsummedCommissionsByTel = async (req, res) => {
  try {
    let tel = req.user.partner_phone;
    if (req.user.partner_name === "NBA_PLATEFORM") {
      tel = req.body.tel;
    }
    const pipeline = [
      {
        $unwind: "$data",
      },
      {
        $match: {"data.tel": tel},
      },
      // {
      //   $addFields: {
      //     orderId: {$toObjectId: "$orderid"},
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "orderservices",
      //     localField: "orderId",
      //     foreignField: "_id",
      //     as: "orderData",
      //   },
      // },
      // {
      //   $project: {
      //     _id: 0,
      //     createdAt: 1,
      //     tel: "$data.tel",
      //     iden: "$data.iden",
      //     name: "$data.name",
      //     address: "$data.address",
      //     tel: "$data.tel",
      //     commission_amount: "$data.commission_amount",
      //     vat3percent: "$data.vat3percent",
      //     remainding_commission: "$data.remainding_commission",
      //     orderid: "$orderid",
      //     orderData: "$orderData.product_detail",
      //   },
      // },
    ];
    console.log(pipeline)
    const result = await Commission.aggregate(pipeline);

    return res.status(200).send({message: "ดึงข้อมูลสำเร็จ", data: result});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({message: "เกิดข้อผิดพลาดบางอย่าง", data: error.data});
  }
};

module.exports.GetTotalBonus = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalBonus: {$sum: "$bonus"},
        },
      },
      {
        $project: {
          _id: 0,
          totalBonus: 1,
        },
      },
    ];

    const result = await Commission.aggregate(pipeline);

    return res.status(200).send({message: "ดึงข้อมูลสำเร็จ", data: result});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", data: error.data});
  }
};

module.exports.GetTotalAllSale = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalAllSale: {$sum: "$allSale"},
        },
      },
      {
        $project: {
          _id: 0,
          totalAllSale: 1,
        },
      },
    ];

    const result = await Commission.aggregate(pipeline);

    return res.status(200).send({message: "ดึงข้อมูลสำเร็จ", data: result});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", data: error.data});
  }
};

module.exports.GetCommissionByOrderId = async (req, res) => {
  try {
    const commission = await Commission.find({orderid: req.params.id});
    console.log(commission);
    if (!commission) {
      return res.status(403).send({status: false, message: "ไม่พบข้อมูล"});
    } else {
      return res
        .status(200)
        .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: commission});
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", error: "server side error"});
  }
};

//get All order
module.exports.GetAll = async (req, res) => {
  try {
    const commission = await Commission.find();
    return res
      .status(200)
      .send({status: true, message: "ดึงข้อมูลสำเร็จ", data: commission});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "มีบางอย่างผิดพลาด", error: "server side error"});
  }
};

module.exports.GetTotalPlatformCommission = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalPlatformCommission: {$sum: "$platformcommission"},
        },
      },
      {
        $project: {
          _id: 0,
          totalPlatformCommission: 1,
        },
      },
    ];

    const result = await Commission.aggregate(pipeline);
    console.log(result);

    if (result.length === 0) {
      return res
        .status(404)
        .send({message: "ไม่พบข้อมูล", totalPlatformCommission: 0});
    }

    return res
      .status(200)
      .send({
        message: "ดึงข้อมูลสำเร็จ",
        totalPlatformCommission: result[0].totalPlatformCommission,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "An error occurred", data: error.data});
  }
};

// module.exports.GetTotalAllSaleByTel = async (req, res) => {
//   try {
//     let tel = req.user.phone;
//     console.log(req.user);
//     if (req.user.partner_name === "NBA_PLATEFORM") {
//       tel = req.body.tel;
//     }
//     const pipeline = [
//       {
//         $unwind: "$data",
//       },
//       {
//         $match: {"data.tel": tel},
//       },
//       {
//         $group: {
//           _id: "$data.tel",
//           totalAllSale: {$sum: "$data.commission_amount"},
//         },
//       },
//       // {
//       //   $project: {
//       //     _id: 0,
//       //     customer_tel: "$_id",
//       //     totalAllSale: 1,
//       //   },
//       // },
//     ];

//     const result = await Commission.aggregate(pipeline);
//     console.log(Commission);
//     console.log(result);
//     if (result.length === 0) {
//       return res.status(404).send({message: "ไม่พบข้อมูล", totalAllSale: 0});
//     }

//     return res
//       .status(200)
//       .send({message: "ดึงข้อมูลสำเร็จ", totalAllSale: result[0].totalAllSale});
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .send({message: "An error occurred", data: error.data});
//   }
// };

module.exports.GetTotalAllSaleByTel = async (req, res) => {
  try {
    console.log(req.user);
    let tel = req.user.partner_phone;
    if (req.user.partner_name === "NBA_PLATEFORM") {
      tel = req.body.tel;
    }
    const pipeline = [
      {
        $unwind: "$data",
      },
      {
        $match: {"data.tel": tel},
      },
      {
        $group: {
          _id: "$data.tel",
          totalAllSale: {$sum: "$data.commission_amount"},
        },
      },
      {
        $project: {
          _id: 0,
          tel: "$_id",
          totalAllSale: 1,
        },
      },
    ];

    const result = await Commission.aggregate(pipeline);

    return res.status(200).send({message: "ดึงข้อมูลสำเร็จ", data: result});
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({message: "เกิดข้อผิดพลาดบางอย่าง", data: error.data});
  }
};

module.exports.GetHappyPointByTel = async (req, res) => {
  try {
    console.log(req.user);
    let tel = req.user.partner_phone;
    if (req.user.partner_name === "NBA_PLATEFORM") {
      tel = req.body.tel;
    }

    const exchangePipeline = [
      {
        $match: {tel: tel},
      },
      {
        $group: {
          _id: "$tel",
          totalExchangePoints: {$sum: "$exchangerate"},
        },
      },
    ];

    const exchangeResult = await ExchangeHistory.aggregate(exchangePipeline);

    // Aggregate total happy point by tel
    const allSalePipeline = [
      {
        $unwind: "$data",
      },
      {
        $match: {"data.tel": tel, "data.lv": "owner"},
      },
      {
        $group: {
          _id: "$data.tel",
          totalAllSale: {$sum: "$data.commission_amount"},
        },
      },
      {
        $project: {
          _id: 0,
          customer_tel: "$_id",
          totalAllSale: 1,
        },
      },
    ];

    const allSaleResult = await Commission.aggregate(allSalePipeline);

    // Calculate happy point by subtracting exchange points from total all sale
    const totalExchangePoints =
      exchangeResult.length > 0 ? exchangeResult[0].totalExchangePoints : 0;
    const totalAllSale =
      allSaleResult.length > 0 ? allSaleResult[0].totalAllSale : 0;
    const happyPoint = totalAllSale - totalExchangePoints;

    return res.status(200).send({message: "ดึงข้อมูลสำเร็จ", happyPoint: happyPoint});
    // return res.status(200).send({message: "Success", allSaleResult: allSaleResult});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "An error occurred", data: error.data});
  }
};

//delete order cancel
module.exports.DeleteCommission = async (req, res) => {
  try {
    
    const orderId = req.params.id;
    const order = await Commission.findOne({_id: orderId});

    if (!order) {
      return res.status(403).send({message: "ไม่พบข้อมูลออร์เดอร์"});
    }

    await Commission.findByIdAndRemove(orderId)
      .then((data) => {
        console.log(data);
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถลบรายการนี้ได้`,
            status: false,
          });
        } else {
          res.send({
            message: "ลบรายการนี้เรียบร้อยเเล้ว",
            status: true,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "ไม่สามารถลบรายการนี้ได้",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "ไม่สามารถลบรายการนี้ได้",
      status: false,
    });
  }
};

