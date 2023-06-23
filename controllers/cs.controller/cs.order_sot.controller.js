const {OrderSot} = require('../../models/cs.model/order.sot.model')

exports.getAll = async(req, res)=>{
    try{
        const order_sot = await OrderSot.find();
        if(order_sot){
            return res.status(200).send({status: true, data: order_sot})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const order_sot = await OrderSot.findById(id);
        if(order_sot){
            return res.status(200).send({status: true, data: order_sot})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByOrderId = async(req,res)=>{
    try{
        const order_id = req.params.order_id;
        const order_sot = await OrderSot.findOne({orderid: order_id});
        if(order_sot){
            return res.status(200).send({status : true, data: order_sot});
        }else{
            return res.status(400).send({status: false, message : "ไม่พบรายการที่ค้นหา"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}
