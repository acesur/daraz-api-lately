const express = require('express');
const app = express();
const {mongoose} = require('./database/mongoosedb');
const bodyParser = require('body-parser');
const {User} = require('./model/user.model');
const port = 3000;

//Middleware functions
app.use(bodyParser.json());

//cros headers middleware
app.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//user sign up
app.post('/user', (req, res) => {
    // User sign up
    let body = req.body;
    let password = req.body.password;
    User.hashPassword(password);
    let newUser = new User(body);

    newUser.save().then(() => {
        res.send("User created successfully");
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/user/list',(req,res)=>{
    User.find({

    }).then((users)=>{
        res.send(users);
    }).catch((e)=>{
        res.send(e);
    })
})

//user login
app.post('/user/login',(req,res)=>{
    let mobileNumber=req.body.mobileNumber;
    let password=req.body.password;

    User.findByCredentials(mobileNumber,password).then(()=>{
        res.send("user login successfully");
    }).catch((err)=>{
        res.status(400).send(err);
    });
})

app.listen(port,()=>{
    console.log(`server is listening in port ${port}`);
});
