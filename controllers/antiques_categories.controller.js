var jwt = require("jsonwebtoken");
var Category = require("../models/antiques/antiques_category.model");
var Category_type = require("../models/antiques/antiques_categories_type.model");
var Categories_detail = require("../models/antiques/antiques_categories_details.model");

const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;


module.exports.Getcategory = async (req, res) => {
    try{

        /*Get Data Antiques*/
       const getCate = await Category.find()

       /* TEST JOIN */

       const getJointData = await Category.aggregate([

        {
          $lookup: {
            from: "categories_types",
            localField: "category_type_id",
            foreignField: "type_id",
            as: "all_cate"
          }
        },
        {
            $unwind: "$all_cate"
        },
        {
          $lookup: {
            from: "categories_details",
            localField: "all_cate.detail_id",
            foreignField: "type_id",
            as: "details_product"
          }
        },
        {
            $unwind: "$details_product"
        },
        {
            $lookup: {
              from: "categories_vendor",
              localField: "details_product.vendor_id",
              foreignField: "vendor_id",
              as: "add_vendor"
            }
          }
          

      ]);

      const chk_kkk = await Categories_detail.aggregate([
        {
          $match: {
            type_id: {
            //   $in: [1, 3] // Array of user IDs you're interested in
            $in: [1]
            }
          }
        },
        {
          $lookup: {
            from: "categories_types",
            localField: "type_id",
            foreignField: "type_id",
            as: "product_type"
          }
        },
        {
          $unwind: "$product_type"
        },
        {
          $project: {
            _id: 1,
            name: 1,
            order: "$user_orders"
          }
        }
      ]);
      console.log("getJointData", getJointData)
         return res.status(200).send({message: "Get Data Success", data: getCate});
    }catch(error){
        res.status(500).send({message: "Internal Server Error"});
    }
};
module.exports.CreateCategory = async (req,res) => {
    try{
        var nameData = "กระดาษ";
        const getCateID = await Category.find().sort( { category_id : -1, posts: 1 }).limit(1) ;
        const chkName = await Category.find({category_name : nameData});
        if(chkName.length > 0){
            console.log("Duplicate name in the system");
            return res.status(200).send({message: "Duplicate name in the system",nameData});
        }
        const genCateID = Math.floor(getCateID[0]['category_id'])+1;
        const data_query = {"category_id": genCateID,
                            "category_name": nameData,
                            "category_type": null,
                            "detail_id": null,
                            "vandor_id": null,
                            }
        
        const create_categories = await Category.insertMany(data_query);
        return res.status(200).send({message: "Create Data Successfully",data: create_categories});
    }catch(error){
        res.status(500).send({message: "Internal Server Error"});
    }
};

module.exports.CreateCategoryType = async (req, res) => {
    try{
        var mokup_DataTypeName = "กระดาษแข็ง";
        const chk_nameType = await Category.find({name: mokup_DataTypeName});
        if(mokup_DataTypeName.length > 0){
            console.log("Duplicate name product");
            return res.status(200).send({message: "Internal Server Error", data: mokup_DataTypeName})
        }else{
            console.log("No duplicate");

        }
    }catch(error){
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports.CreateProduct = async (req, res) => {
    try{

    }catch{

    }
}

