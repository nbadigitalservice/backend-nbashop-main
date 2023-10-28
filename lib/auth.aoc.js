const axios = require('axios');

async function TicketFlight(message, token){
    console.log('message', message);
    try{
        await axios.post(process.env.AOC_URL,{
            message : message
        } ,{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        }).then((res)=>{
            console.log('--ค้นหาเที่ยวบิน สำเร็จ --')
        }).catch((err)=>{
            console.log(err);
            console.log('--ค้นหาเที่ยวบิน ไม่สำเร็จ--')
        })
    }catch(err){
        console.log(err);
    }
}
module.exports = {TicketFlight}