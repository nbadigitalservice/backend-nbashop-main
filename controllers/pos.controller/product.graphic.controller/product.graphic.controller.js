const { ProductGraphic } = require('../../../models/pos.models/product.graphic.model');
const multer = require("multer");
const fs = require("fs");
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

module.exports.Create = async (req,res) => {
    try {

        

        let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
        if(err){
            return res.status(403).send({message:'มีบางอย่างผิดพลาด',data:err});
        }
      const reqFiles = [];

      if (!req.files) {
        res.status(500).send({ message: "มีบางอย่างผิดพลาด",data:'No Request Files', status: false });
      } else {
 
        for (var i = 0; i < req.files.length; i++) {
          await uploadFileCreate(req.files, res, { i, reqFiles });
            
        }

        //create collection
        
        console.log(reqFiles);

        //condition
   
    
        const data = {
            name: req.body.name,
            category:req.body.category,
            detail:req.body.detail,
            description:req.body.description,
            imgUrl:reqFiles,
    
      
        }

        console.log(data);

        const productGraphic = new ProductGraphic(data);
        productGraphic.save(error =>{
            if(error){
                res.status(403).send({status:false,message:'ไม่สามารถบันทึกได้',data:error})
            }else{
                res.status(200).send({status:true,message:'บันทึกสำเร็จ'})
            }
        })

        //end

      }

    });

    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
}

//get all product graphic
module.exports.GetProductGraphic = async (req,res) => {
    try {
        const productGraphic = await ProductGraphic.find();
        if(!productGraphic){
            return res.status(403).send({message:'ยังไม่มีสินค้า'})
        }
        return res.status(200).send({status:true,message:'ค้นหาสำเร็จ',data:productGraphic});

    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
}

//get product graphic by id
module.exports.GetProductGraphicById = async (req,res) => {
  try {
    const productGraphic = await ProductGraphic.findById(req.params.id);
    if(!productGraphic){
        return res.status(403).send({message:'ยังไม่มีสินค้า'})
    }
    return res.status(200).send({status:true,message:'ค้นหาสำเร็จ',data:productGraphic});
    
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
}

//update product graphic by id
module.exports.UpdateProductGraphicById = async (req,res) => {
  try {
    const id = req.params.id;
    const dataUpdate = {
      name:req.body.name?req.body.name:null,
      category:req.body.category?req.body.category:null,
      detail:req.body.detail?req.body.detail:null,
      description:req.body.description?req.body.description:null,
    }
    console.log(dataUpdate);
    ProductGraphic.findByIdAndUpdate(id,dataUpdate,{returnDocument:'after'},(err,result) => {
      if(err){
        return res.status(403).send({status:false,message:'ไม่สามารถบันทึกได้',data:err});
      }
      if(result){

        return res.status(200).send({status:true,message:'บันทึกสำเร็จ',data:result});
      }else{
        return res.status(403).send({status:false,message:'บันทึกไม่สำเร็จ'});
      }
    });

    
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
}

//delete product graphic by id 
module.exports.DeleteProductGraphicById = async ( req,res) => {
  try {
    const id = req.params.id;
     const result = await ProductGraphic.findByIdAndDelete(id);
     

     return res.status(200).send({status:true,message:'ลบสินค้าเรียบร้อยแล้ว',data:result})
    
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
}

//method

async function uploadFileCreate(req, res, { i, reqFiles }) {
  const filePath = req[i].path;
  let fileMetaData = {
    name: req.originalname,
    parents: [process.env.GOOGLE_DRIVE_IMAGE_PRODUCT_GRAPHIC],
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
    return res.status(500).send({ message: "Internal Server Error"});
  }
}