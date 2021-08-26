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
    const id='1';
    const username='admin-siavash'
    const password='Si@7257482'
    const friendId='1';
    user=new User({id,username,password,friendId});
    user.save();

    res.json({a:"hi"});
})
app.get('/public/msg/count', (req, res) => {
    res.send('Hello World!')
})

app.get('/public/msg/:count(\\d+)', (req, res) => {
    req.params.count;
    res.send('Hello World!'+req.params.count);
})

app.post('/public/msg', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', (req, res) => {
    let response;
    if(req.body.username && req.body.password){
        const username = req.body.username ;
        const password = req.body.password;
        User.findOne( {username:username} )
        .then(user=>{
            if(user){
                if(password==user.password){
                    response={
                        status:'user login',
                        id:user.id,
                        username:user.username,
                        friendId:user.friendId
                    }
                }else{
                    response={
                        status:'password incorrect',
                    }
                }
            }
            else{
                response={
                    status:'password or ',
                }
            }
        })
        .catch(err=>{
            response={
                status:'err :'+String(err),
            }
        });
    
    }else{
        response={
            status:'bad req',
        }
    }
    res.json(response);

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