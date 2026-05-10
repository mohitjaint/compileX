import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problem : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    language : {
        type: String,
        required: true,
        enum: ['C++', 'Java', 'Python']
    },
    code : {
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true,
        enum: ['Pending', 'Accepted']
    },
    verdict : {
        type: String,        
        required: true,
        enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error']
    },
    executionTime : {
        type: Number,
        required: true
    },
    memoryUsed : {
        type: Number,
        required: true
    },
    submittedAt : {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;