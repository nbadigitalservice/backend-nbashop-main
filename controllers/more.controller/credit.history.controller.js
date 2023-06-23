const {CreditHistory, validate} =require('../../models/more.model/credit.history.model')


exports.create = async(req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({status: false, message: error.details[0].message})
        }
        //check ประเภทที่นำเข้า
        if(req.body.type==='เครดิตเข้า' || req.body.type === 'เครดิตออก'){
            const credit = await CreditHistory.create(req.body);
            if(credit){
                return res.status(201).send({status: true,message: 'สร้างรายการเรียบร้อย'})
            }else{
                return res.status(400).send({status: false, message: 'สร้างรายการไม่สำเร็จ'})
            }
        }else{
            return res.status(400).send({status: false, message: "ประเภทจะต้องเป็น เครดิตเข้า หรือ เครดิตออก เท่านั้น"})
        }
       
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลา'})
    }
}

exports.getAll = async(req,res)=>{
    try{
        const history = await CreditHistory.find();
        if(history){
            return res.status(200).send({status: true, data: history})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByShopId = async(req, res)=>{
    try{
        const shop_id = req.params.shop_id;
        const history = await CreditHistory.find({shop_id: shop_id})
        if(history){
            return res.status(200).send({status: true, data: history})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const history = await CreditHistory.findById(id);
        if(history){
            return res.status(200).send({status: true, data: history})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}