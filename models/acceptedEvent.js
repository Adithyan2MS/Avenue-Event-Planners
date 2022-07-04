const mongoose = require('mongoose')

const acceptedEventSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    howHearAboutUs:{
        type:String,
        required:true
    },
    eventType:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    guestCount:{
        type:String,
        required:true
    },
    additionalNotes:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    eventid:{
        type:String,
        required:true
    },
    members:{
        type:Array,
        default:[]
    }
})

const AcceptedEventModel=mongoose.model("acceptedEvent",acceptedEventSchema)

module.exports = AcceptedEventModel