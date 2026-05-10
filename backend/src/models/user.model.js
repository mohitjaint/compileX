import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    fullName : {
        type: String,
        required: true
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

UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
}

UserSchema.methods.generateAccessToken =  function() {
    return  jwt.sign(
        {
            userId: this._id,
            role: this.role,
            fullName: this.fullName,
            email: this.email
        },
        
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN 
        }
    )
}

UserSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            userId: this._id,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN 
        }
    );
}


const User = mongoose.model('User', userSchema);

export default User;