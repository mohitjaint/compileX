import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    }, 
    passwordHash : {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }, 
    avatarUrl : {
        type: String,
        default: ''
    },
    refreshToken : {
        type: String,
        default: ''
    }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) {
        return next();
    }
    this.passwordHash = bcrypt.hash(this.passwordHash, 10);
});



const User = mongoose.model('User', userSchema);

export default User;