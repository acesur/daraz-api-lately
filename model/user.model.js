const mongoose=require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema=new mongoose.Schema({
    mobileNumber:{
        type:Number,
        required:true,
        minlength:10,
        index:true,
        unique:true,
        trim:true
    },
    smsCode:{
        type:Number,
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
        unique:true,
        index: true,
        required:true,
        trim:true
    },
    password:{
        type: String,
        required: true,
        minLength:5,
        trim: true
    },
    image:{
        type:String
    }
});

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
