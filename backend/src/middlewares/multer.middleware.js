import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js';

// Allow only image files
const fileFilter = (req, file, cb) => {
    const allowedExts = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/') && allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Only image files are allowed'), false);
    }
}

const destinationPath = path.join('public', 'avatars');

const storage = multer.diskStorage({
destination: function (req, file, cb) {
    // Ensure the destination directory exists
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
},
filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, req.user._id + Date.now() + ext);
}

});

const uploadAvatar = multer({ 
    storage, 
    fileFilter, 
    limits: {
        fileSize: 2 * 1024 * 1024
    } })
    .single('avatar');


export {
    uploadAvatar
}