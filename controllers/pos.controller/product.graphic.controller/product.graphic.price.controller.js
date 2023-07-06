const {ProductGraphicPrice} = require("../../../models/pos.models/product.graphic.price.model")

module.exports.Create = async ( req,res ) => {
    try {
        const data = {
            product_graphic_id:req.body.product_graphic_id,
            price:req.body.price,
            cost:req.body.cost,
            dealer_price:req.body.dealer_price,
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