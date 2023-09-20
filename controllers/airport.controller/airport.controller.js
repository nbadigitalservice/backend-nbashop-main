const {ApiAirport} = require('../../models/airport/airport.model');

exports.getAll = async (req, res)=>{
    try{
        const airports = await ApiAirport.find();
        if(airports){
            return res.status(200).send(airports);
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลสนามบินไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const airports = await ApiAirport.findOne({id:id})
        if(airports){
            return res.status(200).send(airports)
        }else{
            return res.status(400).send({message: 'ไม่พบข้อมูลที่ค้นหา'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}