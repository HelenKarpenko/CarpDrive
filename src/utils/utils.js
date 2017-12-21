const crypto = require('crypto');
const folderCtrl = require('../storage/controllers/folderController');

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
            .randomBytes(length+1)
            .toString('base64').substr(0,length-1);
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

module.exports.isOwner = async(req, res, next) => {
    let folder = await folderCtrl.getMyDrive(req.params.id);
    if(String(req.user._id) != String(folder.owner)){
        error(401,"unauthorized",next);
    }
    next();
}