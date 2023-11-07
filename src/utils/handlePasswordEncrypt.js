import logger from './handleServerLog.js';
import bcrypt from 'bcryptjs';

const handlePasswordEncrypt = async (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                logger.log('error', err);
                reject(err);
            } else {
                bcrypt.hash(password, salt, (err, hashedPassword) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hashedPassword);
                    }
                });
            }
        });
    });
};

export default handlePasswordEncrypt;
