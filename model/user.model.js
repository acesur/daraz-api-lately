const mongoose=require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const UserSchema=new mongoose.Schema({
    mobileNumber:{
        type:Number,
        required:true,
        minlength:10,
        trim:true
    },
    smsCode:{
        type:String,
        required:true,
        minlength:4,
        trim:true
    },
   fullName:{
       type:String,
       required:true,
       minLength: 3,
       trim:true
   },
    email:{
       type:String,
        required:true,
        trim:true
    },
    password:{
        type: String,
        required: true,
        minLength:5,
        trim: true
    }
});

UserSchema.statics.hashPassword = function(password, callback) {
    bcrypt.genSalt(10,(err, salt)=> {
        if (err)
            return callback(err);
        bcrypt.hash(password, salt,(err, hash)=> {
            return callback(err, hash);
        });
    });
};

UserSchema.statics.findByCredentials = function (mobileNumber, password) {
    let User = this;
    return User.findOne({ mobileNumber }).then((user) => {
        if (!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            })
        })
    })
};

const User=mongoose.model('User',UserSchema);
module.exports={User};
