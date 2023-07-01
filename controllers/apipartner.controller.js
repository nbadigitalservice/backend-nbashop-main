const {ApiPartner} = require('../models/apipartner.model');
const jwt = require('jsonwebtoken');

module.exports.Create = async (req,res) => {
    try {
        const partner_name = req.body.partner_name;
        const payload = {
            partner_name:partner_name,
            
        }
        const token = jwt.sign(payload,process.env.API_PARTNER_KEY);

        const data = {
            partner_name:partner_name,
            token:token
        }

        const apiPartner = new ApiPartner(data);

        apiPartner.save(error=>{
            if(error){
                console.log(error);
                return res.status(403).send({message:'ไม่สามารถบันทึกได้',data:{error_code:error.code}})
            }else{
                return res.status(200).send({message:'บันทึกสำเร็จ'});
            }
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:'Internal Server Error'});
    }
}