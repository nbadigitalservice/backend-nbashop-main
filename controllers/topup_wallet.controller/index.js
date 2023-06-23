const {TopupWallet} = require('../../models/topup_wallet.model/topup_wallet.model')

exports.getAll = async(req, res)=>{
    try{
        const topup_wallet = await TopupWallet.find();
        if(topup_wallet){
            return res.status(200).send({status: true, data: topup_wallet})
        }else{
            return res.status(400).send({status: false, message :'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getByPartnerId = async(req, res)=>{
    try{
        const partner_id = req.params.partner_id; 
        const topup_wallet = await TopupWallet.find({partner_id : partner_id});
        if(topup_wallet){
            return res.status(200).send({status: true, data: topup_wallet})
        }else{
            return res.status(400).send({status: false, message :'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id; 
        const topup_wallet = await TopupWallet.findById(id);
        if(topup_wallet){
            return res.status(200).send({status: true, data: topup_wallet})
        }else{
            return res.status(400).send({status: false, message :'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}