const mongoose = require('mongoose')

const eventDetailSchema  = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    howHearAboutUs:{
        type:String,
        required:true,
    },
    eventType:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    guestCount:{
        type:String,
        required:true,
    },
    additionalNotes:{
        type:String,
        required:true,
    }
})

const EventDetailModel=mongoose.model("eventDetail",eventDetailSchema)

module.exports = EventDetailModel