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
        required: true,
        maxlength: 100000 // 100 KB
    },
    status : {
        type: String,
        required: true,
        enum: [
            'Pending',
            'Judging',
            'Completed',
            'Failed'
        ],
        default: 'Pending'
    },
    verdict : {
        type: String,        
        required: true,
        enum: [
            'Accepted',
            'Wrong Answer',
            'Time Limit Exceeded',
            'Runtime Error',
            'Compilation Error',
            'Memory Limit Exceeded'
        ],
        default: null
    },
    executionTime : {
        type: Number,
        required: true,
        default: 0
    },
    memoryUsed : {
        type: Number,
        required: true,
        default: 0
    },
    submittedAt : {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;