const mongoose = require('mongoose');
const Joi = require('joi');

const CommisionSchema = new mongoose.Schema({

        project_type:{type:String,required:true}, //business group
        invoice:{type:String,required:true,unique:true},
        details:{type:Object,required:true},
        total_price:{type:Number,required:true},
        total_cost:{type:Number,required:true},
        total_profit:{type:Number,required:true},
        commision_owner:{type:{tel:{type:String,required:true},commision:{type:Number,required:true}}},
        commision_lv1:{type:{tel:{type:String,required:true},commision:{type:Number,required:true}}},
        commision_lv2:{type:{tel:{type:String,required:true},commision:{type:Number,required:true}}},
        commision_lv3:{type:{tel:{type:String,required:true},commision:{type:Number,required:true}}},  

});

const Commission = new mongoose.model('Commision',CommisionSchema);

const Validate = (data)=>{
    const schema = Joi.object({
        project_type: Joi.string().required().label('กรุณาระบุประเภทของงาน'),
        invoice:Joi.string().required().label('กรุณาระบุเลข invoice'),
        details:Joi.object(),
        total_price:Joi.number().required().label('กรุณาระบุราคางาน'),
        total_cost:Joi.number().required().label('กรุณาระบุต้นทุนงาน'),
        total_profit:Joi.number().required().label('กรุณาระบุกำไร'),
        commision_owner:Joi.object(
            {
                tel:Joi.string().required().label('กรุณาระบุเบอร์โทรของ owner'),
                commission:Joi.number().required().label('กรุณาระบุค่าคอมมิชชั่นของ owner')
            }
        ).required().label('กรุณาระบุกำไรของ owner'),
        commision_lv1:Joi.object(
            {
                tel:Joi.string().required().label('กรุณาระบุเบอร์โทรของ lv1'),
                commission:Joi.number().required().label('กรุณาระบุค่าคอมมิชชั่นของ lv1')
            }
        ).required().label('กรุณาระบุกำไรของ lv1'),
        commision_lv2:Joi.object(
            {
                tel:Joi.string().required().label('กรุณาระบุเบอร์โทรของ lv2'),
                commission:Joi.number().required().label('กรุณาระบุค่าคอมมิชชั่นของ lv2')
            }
        ).required().label('กรุณาระบุกำไรของ lv2'),
        commision_lv3:Joi.object(
            {
                tel:Joi.string().required().label('กรุณาระบุเบอร์โทรของ lv3'),
                commission:Joi.number().required().label('กรุณาระบุค่าคอมมิชชั่นของ lv3')
            }
        ).required().label('กรุณาระบุกำไรของ lv3'),
    });
    return schema.validate(data);
}

module.exports = { Commission,Validate }