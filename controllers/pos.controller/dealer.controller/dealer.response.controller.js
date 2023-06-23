const  {DealerResponse,validate} = require("../../../models/pos.models/dealer.response.model")


exports.create = async(req, res)=>{
    try{
        console.log(req.body);
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({message : error.details[0].message, status: false});
        }
        
        const dealerResponse = await DealerResponse.create(req.body);
        if(dealerResponse){
            return res.status(201).send({message:"เพิ่มข้อมูลเรียบร้อย", status:true, result: dealerResponse});
        }else{
            return res.status(400).send({message: "เพิ่มข้อมูลไม่สำเร็จ", status: false})
        }
    }catch(err){
        console.log(err);
        return res.status(400).send({message: err._message });
    }
}

exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        const dealerResponse = await DealerResponse.findByIdAndUpdate(id, req.body);
        if(dealerResponse){
            return res.status(200).send({message:"แก้ไขข้อมูลเรียบร้อย", status:true});
        }else{
            return res.status(400).send({message: "แก้ไขข้อมูลไม่สำเร็จ", status: false})
        }
    }catch(err){
        console.log(err);
        return res.status(400).send({message: err._message});
    }
}

exports.delete = async(req, res)=>{
    try{
        const id = req.params.id;
        const dealerResponse = await DealerResponse.findByIdAndDelete(id);
        if(dealerResponse){
            return res.status(200).send({message: "ลบข้อมูลสำเร็จ", status: true});
        }else{
            return res.status(400).send({status: false, message : "ลบข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(400).send({message: err._message});
    }
}

exports.findAll = async(req,res)=>{
    console.log("ค้นหา...")
    try{
        const dealerResponse = await DealerResponse.find();
        if(dealerResponse){
            return res.status(200).send({status: true, data: dealerResponse});
        }else{
            return res.status(400).send({status: false, message: "ดึงข้อมูลไม่สำเร็จ"});
        }
    }catch(err){
        console.log(err);
        return res.status(400).send({message: "มีบางอย่างผิดพลาด"});
    }
}

exports.findById = async(req, res)=>{
    try{
        const id = req.params.id;
        const dealerResponse = await DealerResponse.findById(id);
        if(dealerResponse){
            return res.status(200).send({status: true, data: dealerResponse});
        }else{
            return res.status(400).send({status : false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(400).send({message: err._message});
    }
}
exports.findByDealerId = async(req, res)=>{
    try{
        const id = req.params.id;
        
        const dealerResponse = await DealerResponse.find({dealer_id : id});
        if(dealerResponse){
            return res.status(200).send({status: true, data: dealerResponse});
        }else{
            return res.status(400).send({status : false, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(400).send({message : err._message});
    }
}