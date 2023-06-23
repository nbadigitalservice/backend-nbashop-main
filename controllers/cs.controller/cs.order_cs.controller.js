const {OrderCs, validate} = require("../../models/cs.model/order.cs.model");

exports.getAll = async(req, res)=>{
    try{
        const order_cs = await OrderCs.find();
        if(order_cs){
            return res.status(200).send({status: true, data: order_cs});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByShopId = async(req, res)=>{
    try{
        const shop_id = req.params.shop_id;
        const order_cs = await OrderCs.find({shop_id : shop_id});
        if(order_cs){
            return res.status(200).send({status: true, data: order_cs});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req,res)=>{
    try{
        const id = req.params.id;
        const order_cs = await OrderCs.findById(id);
        if(order_cs){
            return res.status(200).send({status: true, data: order_cs});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : 'มีบางอย่างผิดพลาด'})
    }
}

