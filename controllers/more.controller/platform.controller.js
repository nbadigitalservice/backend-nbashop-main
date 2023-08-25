const axios = require('axios');

exports.getByTel = async (req, res)=>{
    try{
        await axios.get(`${process.env.NBA_PLATFORM}public/member/tel/${req.params.tel}`, {
            headers: {
                'token' : `${process.env.NBA_PLATFORM_SECRET_KEY}`
            }
        }).then((r)=>{
            return res.status(200).send({status: true , data: r.data.data})
        }).catch((err)=>{
            console.log(err);
            return err.status(400).send({status: false, message: 'ไม่พบเบอร์ผู้ใช้ Platform เบอร์นี้'})
        })
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}

exports.giveCommission = async(req, res)=>{
    try{
        await axios.post(`${process.env.NBA_PLATFORM}public/member/givecommission`, req.body, {
            headers: {
                'token' : `${process.env.NBA_PLATFORM_SECRET_KEY}`
            }
        }).then(()=>{
            return res.status(200).send({status: true, message: 'คืนค่าคอมมิชชั่นสำเร็จ'})
        }).catch((err)=>{
            console.log(err);
            return res.status(400).send({message: 'มีบางอย่างผิดพลาด'})
        })
    }catch(err){
        console.log(err);
        return res.status(500).send({message: "มีบางอย่างผิดพลาด"})
    }
}

exports.giveHappyPoint = async (req,res)=>{
    try{
        await axios.post(`${process.env.NBA_PLATFORM}public/member/givehappypoint`, req.body, {
            headers: {
                'token' : `${process.env.NBA_PLATFORM_SECRET_KEY}`
            }
        }).then(()=>{
            return res.status(200).send({status: true, message: 'คืนค่าคอมมิชชั่นสำเร็จ'})
        }).catch((err)=>{
            console.log(err);
            return res.status(400).send({message: 'มีบางอย่างผิดพลาด'})
        })
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}