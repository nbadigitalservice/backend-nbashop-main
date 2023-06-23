const { BookingParcel } = require("../../models/express.model/booking.parcel.model");

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const booking_parcel = await BookingParcel.findById(id);
        if(booking_parcel){
            return res.status(200).send({status: true, data: booking_parcel})
        }else{
            return res.status(400).send({message: 'ดึงพัสดุไม่สำเร็จ'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'มีบางอย่างผิดพลาด'})
    }
}