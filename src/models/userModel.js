let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: String,
    login: String,
    password: String,
    folder: Schema.Types.ObjectId,
    sharedWithMe: {
        folders: [Schema.Types.ObjectId],
        files: [Schema.Types.ObjectId]
    }
});

module.exports = mongoose.model('User', userSchema);