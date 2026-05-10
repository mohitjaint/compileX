import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    contest : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Contest',
        required : true
    },
    score :{
        type : Number,
        default : 0
    },
    penalty : {
        type : Number,
        default : 0
    }, 
    solvedProblems : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Problem'
    }],
    rank : {
        type : Number,
        default : 0
    },
    registeredAt : {
        type : Date,
        default : Date.now
    }
},{timestamps : true});