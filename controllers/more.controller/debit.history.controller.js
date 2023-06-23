const {DebitHistory , validate} = require('../../models/more.model/debit.history.model')

exports.create = async(req,res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({status: false, message: error.details[0].message})
        }
        const debit = await DebitHistory.create(req.body);
        if(debit){
            return res.status(201).send({status: true,message: 'สร้างรายการเรียบร้อย'})
        }else{
            return res.status(400).send({status: false, message: 'สร้างรายการไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req,res)=>{
    try{
        const id = req.params.id;
        const debit = await DebitHistory.findById(id);
        if(debit){
            return res.status(200).send({status: true, data: debit});
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByShopId = async(req,res)=>{
    try{
        const shop_id = req.params.shop_id;
        const history = await DebitHistory.find({shop_id: shop_id})
        if(history){
            return res.status(200).send({status: true, data: history});
        }else{
            return res.status(400).send({status: false, message : 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}