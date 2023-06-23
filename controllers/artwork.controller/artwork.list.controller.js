const {ArtworkList, validate} =  require('../../models/artwork.model/artwork.list.model')

exports.create = async(req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({message : error.details[0].message, status : false});
        }
        const checklist = await ArtworkList.findOne({type:req.body.type})
        if(checklist){
            return res.status(400).send({message : 'มีรายการบริการนี้แล้ว', status : false})
        }
        const artwork = await ArtworkList.create(req.body);
        if(artwork){
            console.log(artwork);
            return res.status(201).send({message : "เพิ่มข้อมูลสำเร็จ", status: true, result: artwork});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
}

exports.findAll = async(req, res) => {
    try{
        const artwork_list = await ArtworkList.find();
        if(artwork_list){
            return res.status(200).send({status : true, data : artwork_list})
        }else{
            return res.status(400).send({message : "ดึงข้อมูลไม่สำเร็จ", status : false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
}

//แก้ไข
exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        console.log(req.body);
        const artwork = await ArtworkList.findByIdAndUpdate(id, req.body);
        if(artwork){
            return res.status(200).send({message : "แก้ไขข้อมูลสำเร็จ", status : true, result: artwork})
        }else{
            return res.status(400).send({message : "แก้ไขข้อมูลไม่สำเร็จ", status : false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : "มีบางอย่างผิดพลาด", status:false})
    }
}
//delete
exports.delete = async(req,res)=>{
    const id = req.params.id;
    try{
        const artwork = await ArtworkList.findByIdAndDelete(id);
        if(artwork){
            return res.status(200).send({message: "ลบข้อมูลสำเร็จ", status: true})
        }else{
            return res.status(500).send({message : "ลบไม่สำเร็จ", status : false})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message :"มีบางอย่างผิดพลาด" ,status : false})
    }
}