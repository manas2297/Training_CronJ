const mongoose = require('mongoose');

const EmpSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type : Number,
        required: true
    },
    salary:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    remarks:{
        type:String,
        required:false
    }
});

const Employee = module.exports = mongoose.model('Employee',EmpSchema);