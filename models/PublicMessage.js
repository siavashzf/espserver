const mongoose = require('mongoose');

const PublicMessageSchema = new mongoose.Schema({
    msgId:{
        type:String,
        requierd:true,
        uniqe:true,
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
    }


});
const PublicMessage = mongoose.model('PublicMessage',PublicMessageSchema);
module.exports=PublicMessage;
