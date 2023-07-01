const jwt = require('jsonwebtoken');

module.exports = AuthApiPartner = async (req,res,next) => {
    const token = req.headers['auth-token'];
    if(!token){
        return res.status(401).send({message:'ไม่มีสิทธิ์เข้าถึง'});
    }else{
        jwt.verify(token,process.env.API_PARTNER_KEY,(error,decoded)=>{
            if(error){
                return res.status(401).send({message:'ไม่มีสิทธ์เข้าถึง',error:error});
            }else{
                if(decoded && decoded.partner_name ==='NBA_PLATEFORM'){
                       next()
                }else{
                    return res.status(401).send({message:'ไม่มีสิทธิ์เข้าถึง'});
                }
            }
        });

    }

}