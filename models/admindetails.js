const mongoose = require('mongoose')

const adminDetailSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const AdminDetailModel=mongoose.model("admin",adminDetailSchema)

module.exports = AdminDetailModel