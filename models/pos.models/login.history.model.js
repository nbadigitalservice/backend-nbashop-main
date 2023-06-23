const mongoose = require("mongoose");

const LoginHistorySchema = new mongoose.Schema({
    "name" : {type: String, require: true},
    "ref": {type: Object, require: true}, //ข้อมูลอ้างอิงการเข้าสู่ระบบ
    "timestamp" : {type:Date, require: true}
})

const LoginHistory = mongoose.model('login_history', LoginHistorySchema)

module.exports = {LoginHistory}