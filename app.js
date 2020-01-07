const express = require('express');
const app = express();
const {mongoose} = require('./database/mongoosedb');
const bodyParser = require('body-parser');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

//import model
const {User} = require('./model/user.model');
const {Product}=require('./model/product.model');
//define port number
const port = 3000;
//more length of salt means more time require to decrypt make stronger hashing
const saltRounds=10;
//anything could be my secrete
const jwtSecret = "0123456789abcdefghijklmnopqrstuvwxyz";

//Middleware functions
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

//cros headers middleware to allow access to cross origin resource sharing
app.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//user sign up
app.post('/user/signup', (req, res, next) => {
    let password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hash)=> {
        if (err) {
            let err =  new Error('Could not hash!');
            err.status = 500;
            return next(err);
        }
        User.create({
            mobileNumber: req.body.mobileNumber,
            smsCode: req.body.smsCode,
            fullName: req.body.fullName,
            email: req.body.email,
            password:hash,
            image: req.body.image
        }).then((user) => {
            let token = jwt.sign({ _id: user._id }, jwtSecret);
            res.json({ status: "Signup success!", token: token });
        }).catch(next);
    });
});

//get all registered user or check how many user are there in database
app.get('/user/list',(req,res)=>{
    User.find({

    }).then((users)=>{
        res.send(users);
    }).catch((e)=>{
        res.send(e);
    })
});

//user login
app.post('/user/login', (req, res, next) => {
    User.findOne({ mobileNumber: req.body.mobileNumber })
        .then((user) => {
            if (user == null) {
                let err = new Error('User not exist');
                err.status = 401;
                return next(err);
            } else {
                //inbuilt method of bcrypt to compare plain password with hash password
                bcrypt.compare(req.body.password, user.password)
                    .then((isCorrectPassowrd) => {
                        if (!isCorrectPassowrd) {
                            let err = new Error('Wrong Password');
                            err.status = 401;
                            return next(err);
                        }
                        let token = jwt.sign({ _id: user._id }, jwtSecret);
                        res.json({ status: 'Login Successfully', token: token });
                    }).catch(next);
            }
        }).catch(next);
});

//post products or items
app.post('/products',(req,res)=>{
    let newProduct = new Product(req.body);
    newProduct.save().then((productDoc)=>{
        res.send(productDoc);
    });
});

//get all the products or items list
app.get('/product/list',(req,res)=>{
    Product.find({}).then((productList)=>{
        res.send(productList);
    }).catch((e)=>{
        res.send(e);
    })
});

//start the server on specified port
app.listen(port,()=>{
    console.log(`server is listening in port ${port}`);
});

