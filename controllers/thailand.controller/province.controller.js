const {ApiProvince} = require('../../models/thailand/province.model');

exports.getAll = async (req, res)=>{
    try{
        const provinces = await ApiProvince.find();
        if(provinces){
            return res.status(200).send(provinces);
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลจังหวัดไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const province = await ApiProvince.findOne({id:id})
        if(province){
            return res.status(200).send(province)
        }else{
            return res.status(400).send({message: 'ไม่พบข้อมูลที่ค้นหา'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}