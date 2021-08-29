const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("mongo Connected"))
.catch(err=>console.log(err));

const User = require('./models/User');
const PrivateMessage = require('./models/PrivateMessage');
const PublicMessage = require('./models/PublicMessage');

app.use(bodyParser.json())
//app.use(express.bodyParser());

app.get('/', (req, res) => {
    const msgId=Math.floor(Math.random() * 1000);
    const userId='1'
    const message='سلام خوبی چه خبر'
    const expiration='1';
    const production='1';
    privateMessage=new PrivateMessage({msgId,userId,message,expiration,production});
    privateMessage.save();

    res.json({a:"hi"});
})

app.get('/private/msg', (req, res) => {
    let response;
    if(req.headers.username==undefined || req.headers.password==undefined){
        response={status:'no authorization',head:req.headers}
        res.json(response);
        return;
    }
    console.log({userName:req.headers.username,password:req.headers.password});
    console.log("s1");
    User.findOne({userName:req.headers.username,password:req.headers.password})
    .then(user=>{
        console.log("s2");
        if(user){
            console.log("s3");
            PrivateMessage.find({userId:user.id})
            .then(privateMessages=>{
                console.log("s4");
                if(privateMessages){
                    console.log("s5");
                    let message=new Array();
                    for (let index = 0; index < privateMessages.length; index++) {
                        console.log(index);
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
        }

    })
    .catch(err=>{
        response={status:"err : "+String(err)}
        res.json(response);
    })
})


app.get('/public/msg', (req, res) => {
    let response;
    let message=new Array();
    PublicMessage.find()
    .then(publicMessages=>{
        if(publicMessages){
            for (let index = 0; index < publicMessages.length; index++) {
                message.push(publicMessages[index]["message"]);
            }
            response={message:message, status:'ok'}
            
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


app.post('/public/msg', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', (req, res) => {
    let response;
    if(req.body.userName && req.body.password){
        const userName = req.body.userName ;
        const password = req.body.password;
        User.findOne( {userName:userName} )
        .then(user=>{
            if(user){
                if(password==user.password){
                    response={
                        status:'user login',
                        id:user.id,
                        userName:user.userName,
                        password:user.password,
                        friendId:user.friendId,
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
    
    }else{
        response={
            status:'bad req',
        }
        res.json(response);
    }
})


app.put('/public/msg',(req, res) => {
    let response;

    const msgId = req.body.msgId;
    const message = req.body.message
    const expiration = req.body.expiration
    const production = req.body.production
    if(msgId && message && expiration && production){
        const newPublicMessage = new PublicMessage({msgId,message,expiration,production});
        newPublicMessage.save()
        .then(publicMessage=>{
            response={
                status:'publicMessage saved',
            }
        })
        .catch(err=>{
            response={
                status:'err : '+String(err),
            }  
        });
    }
    res.json(response);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})