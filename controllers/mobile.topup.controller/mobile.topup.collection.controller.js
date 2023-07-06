const {MobileTopup} = require('../../models/mobile_topup.model/mobile_topup.model')


exports.getAll = async(req, res)=>{
    try{
        const order = await MobileTopup.find();
        if(order){
            return res.status(200).send({status: true, data: order})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'ดึงข้อมูลไม่สำเร็จ'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const order = await MobileTopup.findById(id);
        if(order){
            return res.status(200).send({status: true, data: order})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'ดึงข้อมูลไม่สำเร็จ'})
    }
}

exports.getByShopId = async(req, res)=>{
    try{
        const shop_id = req.params.shop_id;
        const order = await MobileTopup.find({shop_id: shop_id})
        if(order){
            return res.status(200).send({status: true, data: order})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'ดึงข้อมูลไม่สำเร็จ'})
    }
}
