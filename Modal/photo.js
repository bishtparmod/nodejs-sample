const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    },
    photo:{
        type:String,
        required:true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Photos',photoSchema)
