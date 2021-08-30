const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI
const uuid = require('uuid');
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("mongo Connected"))
.catch(err=>console.log(err));

const User = require('./models/User');
const PrivateMessage = require('./models/PrivateMessage');
const PublicMessage = require('./models/PublicMessage');

app.use(bodyParser.json())
//app.use(express.bodyParser());

app.get('/', (req, res) => {

    res.json({a:"hi"});
})


app.get('/login', (req, res) => {
    let response;
    if(req.headers.username==undefined || req.headers.password==undefined){
        response={status:'no authorization or bad req' }
        res.json(response);
        return;
    }else{
        const userName = req.headers.username ;
        const password = req.headers.password;
        User.findOne( {userName:userName} )
        .then(user=>{
            if(user){
                console.log("hi ime in");
                if(password==user.password){
                    response={
                        status:'user logedin',
                        userName:user.userName,
                        password:user.password
                    }
                    res.json(response);
                }else{
                    response={
                        status:'password incorrect',
                    }
                    res.json(response);
                }
            }
            else{
                response={
                    status:'user not registerd ',
                }
                res.json(response);
            }
            
        })
        .catch(err=>{
            response={
                status:'err :'+String(err),
            }
            res.json(response);
        });
    }
})

app.get('/private/msg', (req, res) => {
    let response;
    if(req.headers.username==undefined || req.headers.password==undefined){
        response={status:'no authorization',head:req.headers}
        res.json(response);
        return;
    }
    User.findOne({userName:req.headers.username,password:req.headers.password})
    .then(user=>{
        if(user){
            PrivateMessage.find({userId:user.id})
            .then(privateMessages=>{
                if(privateMessages){
                    let message=new Array();
                    for (let index = 0; index < privateMessages.length; index++) {
                        message.push(privateMessages[index]["message"]);
                    }
                    response={message:message, status:'ok'}
                }
                else
                {
                    response={status:'on messages'}
                }
                    res.json(response);
            }).catch(err=>{
                response={status:"err : "+String(err)}
                res.json(response);
            })
        }
        else{
            response={status:"not authorization"}
            res.json(response)
        }

    })
    .catch(err=>{
        response={status:"err : "+String(err)}
        res.json(response);
    })
})
app.get('/public/msg', (req, res) => {
    let response;
    if(req.headers.username==undefined || req.headers.password==undefined){
        response={status:'no authorization',head:req.headers}
        res.json(response);
        return;
    }
    let message=new Array();
    let userNames =new Array();
    PublicMessage.find()
    .then(publicMessages=>{
        if(publicMessages){
            for (let index = 0; index < publicMessages.length; index++) {
                message.push(publicMessages[index]["message"]);
            }
        }
        else
        {
            response={status:'on messages'}
        }
            res.json(response);
    })
    .catch(err=>{
        response={status:"err : "+String(err)}
        res.json(response);
    })

})
app.get('/user',(req,res)=>{
    if(req.headers.username==undefined || req.headers.password==undefined){
        response={status:'no authorization',head:req.headers}
        res.json(response);
        return;
    }
    User.find().then(user=>{
        for (let index = 0; index < user.length; index++) {
            userNames.push(user[index]["userName"]);
        }
    })
    .catch(err=>{
        response={status:"err : "+String(err)}
        res.json(response);
    })
    response={message:message,userName:userNames, status:'ok'}
})


app.post('/private/msg', (req, res) => {
    let response;
    if(req.headers.username==undefined || req.headers.password==undefined || req.body.message||req.body.id|| req.body.expiration){
        response={status:'no authorization or bad req' }
        res.json(response);
        return;
    }else{
        if(req.headers.username.indexOf("admin-")!=0){
            response={status:'you are not admin' }
            res.json(response);
            return;
        }else{
            User.findOne( {userName:req.headers.username,password:req.headers.password} )
            .then(user=>{
                if(user){
                    const userId = req.body.id
                    const msgId = uuid.v4();
                    const message = req.body.message;
                    const expiration = req.body.expiration
                    let privateMessage = new PrivateMessage({msgId,userId,message,expiration});
                    privateMessage.save().catch(err=>{
                        response={status:String(err)}
                        res.json(response);
                        return;
                    })

                }else{
                    response={status:'you are not admin'}
                    res.json(response);
                    return;
                }
            })
        }
    }
})
app.post('/public/msg', (req, res) => {
    let response;
    if(req.headers.username==undefined || req.headers.password==undefined || req.body.message || req.body.expiration){
        response={status:'no authorization or bad req' }
        res.json(response);
        return;
    }else{
        if(req.headers.username.indexOf("admin-")!=0){
            response={status:'you are not admin' }
            res.json(response);
            return;
        }else{
            User.findOne( {userName:req.headers.username,password:req.headers.password} )
            .then(user=>{
                if(user){
                    const msgId = uuid.v4();
                    const message = req.body.message;
                    const expiration = req.body.expiration;
                    let publicMessage = new PublicMessage({msgId,message,expiration});
                    publicMessage.save().catch(err=>{
                        response={status:String(err)}
                        res.json(response);
                        return;
                    })

                }else{
                    response={status:'you are not admin'}
                    res.json(response);
                    return;
                }
            })
        }
    }
})
app.post('/user', (req, res) => {
    let response;
    if(req.headers.username==undefined || req.headers.password==undefined || req.body.userName||req.body.password){
        response={status:'no authorization or bad req' }
        res.json(response);
        return;
    }else{
        if(req.headers.username.indexOf("admin-")!=0){
            response={status:'you are not admin' }
            res.json(response);
            return;
        }else{
            User.findOne( {userName:req.headers.username,password:req.headers.password} )
            .then(user=>{
                if(user){
                    response={status:'user already exist'}
                    res.json(response);
                    return;
                }else{
                    const id=uuid.v4();
                    const userName=req.body.userName;
                    const password=req.body.password;
                    const friendId='0';
                    let newUser = new User({id,userName,password,friendId});
                    newUser.save().then(()=>{
                        response={status:'user ceated'}
                        res.json(response);
                        return;
                    })
                    .catch(err=>{
                        response={status:String(err)}
                        res.json(response);
                        return;
                    })
                }
            })
        }
    }
})

app.put('/password',(req, res) => {
    let response;
    if(req.headers.username==undefined || req.headers.password==undefined || req.body.newPassword){
        response={status:'no authorization or bad req' }
        res.json(response);
        return;
    }else{
        const filter = {userName:req.headers.username,password:req.headers.password};
        const update = {password:req.body.newPassword}
        User.findOneAndUpdate(filter,update)
        .then(()=>{
            response={status:'password changed' }
            res.json(response);
        })
        .catch(err=>{
            response={status:'password changed' }
            res.json(response)
        })

    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})