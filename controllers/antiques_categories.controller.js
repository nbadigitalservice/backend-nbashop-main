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

module.exports.CreateCategory = async (req, res) => {
    try{
 
        const getCateName = req.body.getCateName
        const getTypeId = await Category.find().sort({category_id: -1}).limit(2)
        const genTypeId = parseInt(getTypeId[0].category_id)+1 ;
        const category_type_id = req.body.typeId
        const chk_name = await Category.find({category_name: getCateName});
        // console.log(genTypeId);
        if(chk_name.length > 0){
            console.log("ชื่อหมวดหมู่นี้ได้สร้างไปแล้ว");
            return res.status(200).send({message:"ชื่อหมวดหมู่นี้ได้สร้างไปแล้ว"});
        }else{
            let createcategory = {
                category_id: genTypeId,
                category_name : getCateName,
                category_type_id: category_type_id, 
            };

            const createCate = new Category(createcategory);
            const createCateData = await createCate.save();
            return res.status(200).send({message:"สร้างหมวดหมู่สำเร็จ"});
        }
        
   
    }catch(error){
        console.error(error);
        res.status(500).send({message: "Internal Server Error"});

    }
}

module.exports.CreateType = async (req, res) => {
    try{
 
        const getCateId = req.body.getCateId

        const chk_type_id = await Category_type.find().sort({type_id: -1}).limit(2)
        const genTypeId = parseInt(chk_type_id[0].type_id)+1 ;
        if(chk_name.length > 0){
            console.log("ชื่อหมวดหมู่นี้ได้สร้างไปแล้ว");
            return res.status(200).send({message:"ชื่อหมวดหมู่นี้ได้สร้างไปแล้ว"});
        }else{
            let createtype = {
                type_id: "",
                detail_th: genTypeId,
                detail_en : getCateName,
                category_id: chk_type_id, 
                detail_id:"-"
                
            };

            const createType = new Category_type(createtype);
            const createTypeData = await createType.save();
            return res.status(200).send({message:"สร้างหมวดหมู่สำเร็จ",data: createTypeData});
        }
        
   
    }catch(error){
     

    }
}
