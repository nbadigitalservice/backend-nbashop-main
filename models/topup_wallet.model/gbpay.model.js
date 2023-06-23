const mongoose = require('mongoose');

const GbPaySchema = new mongoose.Schema({
    amount : {type: Number, required: true},
    retryFlag : {type: String, required: false, default :''},
    referenceNo : {type: String, required: true},
    gbpReferenceNo : {type: String, required: true},
    currencyCode: {type: String, required: false, default :''},
    resultCode: {type: String, required: false, default :''},
    resultMessage  : {type: String, required: false, default :null},
    fee : {type : Number , required: false, default : 0},
    vat : {type : Number, required : false, default : 0},
    detail : {type: String, required: false, default :''},
    customerName : {type: String, required: false, default :''},
    date : {type: String, required: false, default :''},
    time : {type: String, required: false, default :''},
    paymentType : {type: String, required: false, default :''},
    merchantDefined1 : {type: String, required: false, default :''},
    merchantDefined2 : {type: String, required: false, default :''},
})

const GbPay = mongoose.model('gb_pay', GbPaySchema);

module.exports = {GbPay};