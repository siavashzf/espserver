const mongoose = require('mongoose');

const PublicMessageSchema = new mongoose.Schema({
    msgId:{
        type:String,
        requierd:true,
        unique:true,
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
const PublicMessage = mongoose.model('PublicMessage',PublicMessageSchema);
module.exports=PublicMessage;
