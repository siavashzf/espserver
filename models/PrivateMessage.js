const mongoose = require('mongoose');

const PrivateMessageSchema = new mongoose.Schema({
    msgId:{
        type:String,
        requierd:true,
        unique:true,
    },
    userId:{
        type:String,
        requierd:true
    },
    message:{
        type:String,
        requierd:true
    },
    expiration:{
        type:Date,
        requierd:true
    },
    production:{
        type:Date,
        requierd:true,
        default:Date.now
        
    },

});
const PrivateMessage = mongoose.model('PrivateMessage',PrivateMessageSchema);
module.exports=PrivateMessage;