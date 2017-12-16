let mongoose = require('mongoose');
let Utils = require('@utils');
let Schema = mongoose.Schema;

const ACCESS_TOKEN_LIFE = 60*60*24;             //one day
const REFRESH_TOKEN_LIFE = 60*60*24*1000;

let userSchema = new Schema({
    name: {
        type: String,
        required: true,
        default:"No name"
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String
    },
    tokens: {
        access: {
            value: {
                type: String,
            },
            created: {
                type: Date,
                default: Date.now
            }
        },
        refresh: {
            value: {
                type: String,
            },
            created: {
                type: Date,
                default: Date.now
            }
        }
    },
    myDrive: {
        type: Schema.Types.ObjectId,
        default: null,
    },
    sharedWithMe: {
        type: [Schema.Types.ObjectId],
        default: [],
    },
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.salt = await Utils.crypto.random(16);
        this.password = await Utils.crypto.hash(this.password, this.salt);
        // fill tokens by random bytes
        this.generateAccessToken();
        this.generateRefreshToken();
    }
    next();
})

userSchema.virtual('refreshToken')
    .get(function () {
        return this.tokens.refresh.value;
    })
    .set(function (value) {
        this.tokens.refresh.value = value;
        this.tokens.refresh.created = Date.now();
    })
userSchema.virtual('accessToken')
    .get(function () {
        return this.tokens.access.value;
    })
    .set(function (value) {
        this.tokens.access.value = value;
        this.tokens.access.created = Date.now();
    })

userSchema.methods.verifyAccessToken = function (token) {
     return this.accessToken == token && Math.round((Date.now()-this.tokens.access.created)/1000) < ACCESS_TOKEN_LIFE;
}
userSchema.methods.verifyRefreshToken = function (token) {
    return this.refreshToken == token && Math.round((Date.now()-this.tokens.refresh.created)/1000) < REFRESH_TOKEN_LIFE;
}
userSchema.methods.generateRefreshToken = async function () {
    this.refreshToken = await Utils.crypto.random(32);
}
userSchema.methods.generateAccessToken = async function () {
    this.accessToken = await Utils.crypto.random(32);
}

userSchema.methods.comparePassword = function (plainPassword) {
    return Utils.crypto.compare(plainPassword, this.password, this.salt);
}

userSchema.methods.minInfo = function () {
    return {
        name: this.name,
        username: this.username,
        myDrive: this.myDrive,
        sharedWithMe: this.sharedWithMe,
    };
}

module.exports = mongoose.model('User', userSchema);