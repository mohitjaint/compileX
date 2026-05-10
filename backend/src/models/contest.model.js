import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    }, 
    problems : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem',
            required: true
        }
    ],
    startTime : {
        type: Date,
        required: true
    },
    endTime : {
        type: Date,
        required: true
    },
    creator : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic : {
        type: Boolean,
        default: true
    },
    status : {
        type: String,
        enum: ['upcoming', 'ongoing', 'ended'],
        default: 'upcoming'
    }
},{timestamps: true});

const Contest = mongoose.model('Contest', contestSchema);

export default Contest;