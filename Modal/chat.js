const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    senderId:{
        type:String,
        required:true
    },
    receiverId:{
        type:String,
        required:true
    },
    isphoto:{
        type:Boolean,
        required:true
    },
    url:{
        type:String,
        required:false
    },
    message:{
        type:String,
        required:false
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Chats',chatSchema)
