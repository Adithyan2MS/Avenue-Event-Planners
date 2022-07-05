const mongoose = require('mongoose')
// const ObjectId = Schema.Types.ObjectId;


const eventDetailSchema  = new mongoose.Schema({
        user:mongoose.Schema.Types.ObjectId,
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