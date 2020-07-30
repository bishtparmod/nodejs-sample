const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirm_password:{
        type:String,
        required:true
    },
    stripeCustomerId:{
        type:String,
        required:false
    },
    inventory_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Users',userSchema)
