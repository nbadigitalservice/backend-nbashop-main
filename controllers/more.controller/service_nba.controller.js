const {ServiceNBA, validate_service_nba} = require('../../models/more.model/service.nba.model')
const {PercentCs} = require('../../models/cs.model/percent.model');
exports.create = async(req, res)=>{
    try{
        const productid = await genProductId();
        //fine charge
        const {error} = validate_service_nba(req.body);
        if(error){
            return res.status(400).send({status: false, message: error.details[0].message})
        }
        const service_nba = await ServiceNBA.create({...req.body, productid:productid});
        if(service_nba){
            return res.status(201).send({status: true, data: service_nba});
        }else{
            return res.status(400).send({status: false, message: 'เพิ่มข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
    }
}

exports.delete = async(req, res)=>{
    try{
        const id =req.params.id;
        const service_nba = await ServiceNBA.findByIdAndDelete(id);
        if(service_nba){
            return res.status(200).send({status: true,message: 'ลบข้อมูลสำเร็จ'})
        }else{
            return res.status(400).send({status: false, message: 'ลบข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        const service_nba = await ServiceNBA.findByIdAndUpdate(id, req.body);
        if(service_nba){
            return res.status(200).send({status: true,message: 'แก้ไขข้อมูลสำเร็จ'})
        }else{
            return res.status(400).send({status: false, message: 'แก้ไขข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const service_nba = await ServiceNBA.findById(id);
        if(service_nba){
            return res.status(200).send({status: true, data: service_nba})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        return res.status(500).send({message: 'มีบางอย่างผิดพลา'})
    }
}

exports.getAll = async(req, res)=>{
    try{
        const service_nba = await ServiceNBA.find();
        if(service_nba){
            return res.status(200).send({status: true, data: service_nba})
        }else{
            return res.status(400).send({status: false, message: 'ดึงข้อมูลไม่สำเร็จ'})
        }
    }catch(err){
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}


//สร้างรหัสสินค้า
async function genProductId(){
    const service_nba = await ServiceNBA.find();
    let productid = null;
    if(service_nba.length !==0){
        let num = 0;
        let data = "";
        do{
            num = num+1;
            data = `nba`.padEnd(6, '0')+num;
            check = await ServiceNBA.find({productid: data});
            if(check.length===0){
                productid = `nba`.padEnd(6, '0')+num;
            }
        }while(check.length !==0);
    }else{
        productid = `nba`.padEnd(6, '0')+1;
    }
    return productid;
}