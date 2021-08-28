const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id:{
        type:String,
        requierd:true,
        unique:true,
    },
    userName:{
        type:String,
        requierd:true,
        unique:true,
    },
    password:{
        type:String,
        requierd:true
    },
    friendId:{
        type:String,
        requierd:true
    }


});
const User = mongoose.model('User',UserSchema);
module.exports=User;