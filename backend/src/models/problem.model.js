import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    }, 
    slug : {
        type: String,
        required: true,
        unique: true
    }, 
    statement : {
        type: String,
        required: true
    }, 
    inputFormat : {
        type: String,
        required: true
    }, 
    outputFormat : {
        type: String,
        required: true,
    },
    constraints : {
        type: String,
        required: true
    },
    sampleTestCases : [
        {
            input : {
                type: String,
                required: true
            },
            output : {
                type: String,
                required: true
            }
        }
    ],
    hiddenTestCasesPath: {
        type: String,
        required: true
    },
    timelimit : {
        type: Number,
        required: true
    },
    memorylimit : {
        type: Number,
        required: true
    },
    difficulty : {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    }   
}, {timestamps: true});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;