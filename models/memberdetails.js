const mongoose = require('mongoose')

const memberDetailSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const MemberDetailModel=mongoose.model("member",memberDetailSchema)

module.exports = MemberDetailModel