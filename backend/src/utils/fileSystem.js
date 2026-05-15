import fs from 'fs';
import AdmZip from 'adm-zip';
import ApiError from '../ApiError.js';

export const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {
            recursive: true
        });
    }
};

export const deleteFileIfExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

export const deleteDirectoryIfExists = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, {
            recursive: true,
            force: true
        });
    }
};

export const extractZip = (
    zipFilePath,
    destinationPath
) => {

    try {

        const zip = new AdmZip(zipFilePath);

        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, {
                recursive: true
            });
        }

        zip.extractAllTo(destinationPath, true);

    }
    catch (error) {

        if (
            destinationPath &&
            fs.existsSync(destinationPath)
        ) {
            fs.rmSync(destinationPath, {
                recursive: true,
                force: true
            });
        }

        throw new ApiError(
            500,
            `ZIP extraction failed: ${error.message}`
        );
    }
};

export const parseJSONSafe = (jsonString) => {
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        throw new ApiError(400, 'Invalid JSON format');
    }
};

