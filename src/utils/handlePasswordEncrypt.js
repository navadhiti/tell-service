import logger from './handleServerLog.js';
import bcrypt from 'bcryptjs';

const handlePasswordEncrypt = async (password) => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.genSalt(10, (error, salt) => {
                if (error) {
                    return reject(error);
                }
                bcrypt.hash(password, salt, (error, hashedPassword) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(hashedPassword);
                });
            });
        } catch (error) {
            logger.log('Password Encrypt Error', error);
            reject(error);
        }
    });
};

export default handlePasswordEncrypt;
