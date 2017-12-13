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

module.exports.errors = {
    InvalidRequesDatatError (msg) {
        return {
            name: 'InvalidRequesDatatError',
            message: msg
        }
    }
}
module.exports.sendError = (res, code, msg) => {
    return res.status(code).json({success: false, message: msg}).end();
}