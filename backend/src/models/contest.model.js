import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
const contestSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    }, 
    problems : {
        type : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Problem',
                required: true,
            }
        ],
        validate : [
            {
                validator: (value)=> value.length > 0,
                message: 'A contest must have at least one problem.'
            },
            {
                validator : (value) => {
                    const uniqueProblems = new Set(value.map(String));
                    return uniqueProblems.size === value.length;
                },
                message: 'Problems in a contest must be unique.'
            }
        ]
    }
    ,
    startTime : {
        type: Date,
        required: true
    },
    endTime : {
        type: Date,
        required: true
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic : {
        type: Boolean,
        default: true
    }
},{timestamps: true});

contestSchema.pre('validate', function(next) {
    if (this.startTime >= this.endTime) {
        return next(new ApiError('Start time must be before end time.', 400));
    }
    next();
});

const Contest = mongoose.model('Contest', contestSchema);

export default Contest;