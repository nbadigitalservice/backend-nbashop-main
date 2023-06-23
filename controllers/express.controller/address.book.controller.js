const {AddressRecipient} = require('../../models/express.model/address.recipient.model');
const {AddressSender} = require('../../models/express.model/address.sender.model')


//ผู้รับ
exports.delRecipient= async(req, res)=>{
    try{
        const id = req.params.id;
        const address = await AddressRecipient.findByIdAndDelete(id);
        if(address){
            return res.status(200).send({message: 'ลบข้อมูลที่อยู่ผู้รับสำเร็จ'})
        }else{
            return res.status(400).send({message: 'ลบข้อมูลที่อยู่ผู้รับไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getRecipientByShopId = async (req, res)=>{
    try{
        const shop_id = req.params.id;
        const address = await AddressRecipient.find({shop_id: shop_id});
        if(address){
            return res.status(200).send({data: address});
        }else{
            return res.status(400).send({message:"ดึงข้อมูลที่อยู่ผู้รับไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'});
    }
}



//ผู้ส่ง
exports.delSender= async(req, res)=>{
    try{
        const id = req.params.id;
        const address = await AddressSender.findByIdAndDelete(id);
        if(address){
            return res.status(200).send({message: 'ลบข้อมูลที่อยู่ผู้ส่งสำเร็จ'})
        }else{
            return res.status(400).send({message: 'ลบข้อมูลที่อยู่ผู้ส่งไม่สำเร็จ'})
        }
    }catch(err){
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getSenderByShopId = async (req, res)=>{
    try{
        const shop_id = req.params.id;
        const address = await AddressSender.find({shop_id: shop_id});
        if(address){
            return res.status(200).send({data: address});
        }else{
            return res.status(400).send({message:"ดึงข้อมูลที่อยู่ผู้รับไม่สำเร็จ"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}