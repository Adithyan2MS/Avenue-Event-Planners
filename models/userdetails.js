const mongoose = require('mongoose')

const userDetailSchema  = new mongoose.Schema({
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

const UserDetailModel=mongoose.model("user",userDetailSchema)

module.exports = UserDetailModel