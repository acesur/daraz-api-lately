const mongoose=require('mongoose');


const ProductSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        min:3,
        trim:true
    },
    price:{
        type: Number,
        required: true,
        minlength:1,
        trim: true
    },
    description:{
        type:String,
        required:true,
        minlength: 6,
        trim:true
    },
    specification:{
        type:String,
        minlength:5,
        trim:true
    },
    delivery:{
        type:String,
        required:true,
        minlength:5,
        trim:true
    },
    services:{
        type:String,
        required:true,
        minlength:5,
        trim:true
    },
    productImage:{
        type:String
    }
});

const Product=mongoose.model('Product',ProductSchema);
module.exports = {Product};
