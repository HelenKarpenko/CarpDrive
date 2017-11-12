let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: String,
    login: String,
    password: String,
    isAdmin: Boolean,
    folders: [Schema.Types.ObjectId],
    sharedWithMe: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('User', userSchema);