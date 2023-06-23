const {ChangeStockHistory ,validate } = require('../../../models/pos.models/change.stock.history.model')

exports.createChangeStock = async (req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({status: false, message : error.details[0].message})
        }
        const change_stock = await ChangeStockHistory.create(req.body);
        if(change_stock){
            return res.status(201).send({status: true ,data : change_stock})
        }else{
            return res.status(400).send({status: false, message : "เพิ่มข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}