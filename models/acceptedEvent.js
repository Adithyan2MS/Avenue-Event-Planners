const mongoose = require('mongoose')

const acceptedEventSchema  = new mongoose.Schema({
    Event:{
        type:String,
        required:true,
    }
})

const AcceptedEventModel=mongoose.model("acceptedEvent",acceptedEventSchema)

module.exports = AcceptedEventModel