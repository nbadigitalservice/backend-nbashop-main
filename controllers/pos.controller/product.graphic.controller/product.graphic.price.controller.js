const {ProductGraphicPrice} = require("../../../models/pos.models/product.graphic.price.model")

module.exports.Create = async ( req,res ) => {
    try {
        const data = {
            product_graphic_id:req.body.product_graphic_id,
            price:req.body.price,
            cost_NBA:req.body.cost_NBA,
            profit_NBA:req.body.profit_NBA,
            quantity_per_pack:req.body.quantity_per_pack,
            freight:req.body.freight,
            minimun:req.body.minimun
        }

        const productGraphicPrice = new ProductGraphicPrice(data);

        productGraphicPrice.save(err =>{
            if(err){
                return res.status(403).send({message:'บันทึกไม่สำเร็จ',data:err});
            }else{
                return res.status(200).send({message:'บันทึกสำเร็จ'});
            }
        })            
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:'มีบางอย่างผิดพลาด'})
    }
}

module.exports.GetPrice = async (req,res) => {
    try {
        const productGraphicPrice = await ProductGraphicPrice.find({product_graphic_id:req.params.id});

        if(productGraphicPrice.length<=0){
            return res.status(200).send({status:true,message:'ยังไม่มีการบันทึกราคาสำหรับสินค้านี้'})
        }else{

            return res.status(200).send({status:true,message:'ดึงข้อมูลสินค้าสำเร็จ',data:productGraphicPrice});
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:'มีบางอย่างผิดพลาด'})
    }
}

//update price list
module.exports.updatePriceList = async (req,res) => {
    try {
        const id = req.params.id;
        const dataUpdate = {
            price:req.body.price?req.body.price:null,
            cost_NBA:req.body.cost_NBA?req.body.cost_NBA:null,
            profit_NBA:req.body.profit_NBA?req.body.profit_NBA:null,
            quantity_per_pack:req.body.quantity_per_pack?req.body.quantity_per_pack:null,
            freight:req.body.freight?req.body.freight:null,
            minimun:req.body.minimun?req.body.minimum:null
        }
        ProductGraphicPrice.findByIdAndUpdate(id,dataUpdate,{returnDocument:'after'},(error,result)=>{
            if(error){
                return res.status(500).send({message:'อัพเดทไม่สำเร็จ'});
            }
            if(result){
                return res.status(200).send({status:true,message:'แก้ไขข้อมูลสินค้าสำเร็จ'});
            }else{
                return res.status(200).send({status:false,message:'ไม่สามารถแก้ไขข้อมูล หรือ แก้ไขไม่สำเร็จ กรุณาลองอีกคร้ัง'});
            }
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:'Internal Server Error'});
    }
}

//delete price list
module.exports.DeleteProductGraphicPriceList = async (req,res) => {
    try {
        const id = req.params.id;
        ProductGraphicPrice.findByIdAndDelete(id,{returnOriginal:true},(error,result)=>{
            if(error){
                return res.status(500).send({message:'ลบข้อมูลไม่สำเร็จ'});
            }
            if(result){
                return res.status(200).send({status:true,message:'ลบข้อมูลราคาสินค้าสำเร็จ'});
            }else{
                return res.status(403).send({status:false,message:'ลบข้อมูลราคาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'})
            }
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:'Internal Server Error'});
    }
}