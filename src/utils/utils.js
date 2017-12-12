const crypto = require('crypto');

module.exports.crypto = {
    hash: (plainData, salt) => {
        return crypto
            .createHmac('sha512', salt)
            .update(plainData)
            .digest('hex');
    },
    compare: (plainData, hash, salt) => {
        return this.crypto.hash(plainData, salt) === hash;
    },
    random: (length) => {
        return crypto
            .randomBytes(length)
            .toString('base64');
    }
}