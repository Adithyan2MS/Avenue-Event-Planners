const mongoose = require('mongoose')

const chatDataSchema  = new mongoose.Schema({
    roomId:{
        type:String,
        required:true
    },
    messages:[
        {
        user:{
            type:String,
            required:true,
            },
        message:{
            type:String,
            required:true,
            }
        }
    ]
})

const ChatDataModel=mongoose.model("chat",chatDataSchema)

module.exports = ChatDataModel


// {
//     conversation_id: 12345,
//     time: time,
//     members: ['user1', 'user2'],
//     messages: [
//       {
//          sender: 'user1', 
//          message: 'Hello World', 
//          timestamp: time
//       },
//       {
//          sender: 'user1', 
//          message: 'Hello World', 
//          timestamp: time
//       }],
//    total_messages: 2
// }

// Conversation : {
//  id: 123,
//  members: [ user_id1, user_id2 ]
// }
// Message { conversationId: 123, author: user_2, body: 'Hi what's up' }