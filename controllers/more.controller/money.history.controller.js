const { MoneyHistory , validate} = require("../../models/more.model/money.history.model")


exports.create = async (req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({status: false, message: error.details[0].message})
        }
        const money_history = await MoneyHistory.create(req.body);
        if(money_history){
            return res.status(201).send({status: true, message: "สร้างรายการสำเร็จ"})
        }else{
            return res.status(400).send({status : false, message : "สร้างรายการไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}

exports.getAll = async(req,res)=>{
    try{
        const history = await MoneyHistory.find();
        if(history){
            return res.status(200).send({status: true, data: history})
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.statu(500).send({status: false, message : err._message});
    }
}

exports.getById = async (req,res)=>{
    try{
        const id =  req.params.id;
        const history = await MoneyHistory.findById(id)
        if(history){
            return res.status(200).send({status: true, data : history})
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message})
    }
}

exports.getByShopId = async (req, res)=>{
    try{
        const shop_id = req.params.shop_id
        const history = await MoneyHistory.find({shop_id: shop_id})
        if(history){
            return res.status(200).send({status: true, data : history});
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : err._message})
    }
}

exports.getByPartnerId = async(req, res)=>{
    try{
        const partner_id = req.params.partner_id;
        const history = await MoneyHistory.find({partner_id : partner_id})
        if(history){
            return res.status(200).send({status: true, data: history});
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}