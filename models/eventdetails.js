const mongoose = require('mongoose')

const eventDetailSchema  = new mongoose.Schema({
        id:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        eventdetail:[
        {   
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
    }
]
        
    
})

const EventDetailModel=mongoose.model("eventDetail",eventDetailSchema)

module.exports = EventDetailModel