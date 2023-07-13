//preorder
module.exports.PreOrderProductGraphic = async (req,res) => {
    try {

        const data = {...req.body};

        const axios = require('axios');
        const config = {
            method :'post',
            headers:{
                'Content-Type':'application/json',
                'x-access-token':process.env.NBA_GRAPHIC_API_TOKEN
            },
            url:`${process.env.NBA_GRAPHIC_URL}project`,
            data:data
        }

        await axios(config).then(response=>{
            return res.status(200).send({status:true,data:response.data});
        })
        .catch(error=>{
            console.error(error);
            return res.status(403).send({status:false,message:'axios error',data:error.message})
        })

        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:'Internal Server Error'});
    }
}