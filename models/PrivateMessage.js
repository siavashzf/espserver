const mongoose = require('mongoose');

const PrivateMessageSchema = new mongoose.Schema({
    msgId:{
        type:String,
        requierd:true
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
        type:String,
        requierd:true
    },
    production:{
        type:String,
        requierd:true
    },


});
const PrivateMessage = mongoose.model('PrivateMessage',PrivateMessageSchema);
module.exports=PrivateMessage;