let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let folderSchema = new Schema({
    img: String,
    name: String,
    size: Number,
    type: String,
    location: String,
    owner: String,
    modified: {type: Date, default: Date.now},
    created: {type: Date, default: Date.now},
    description: String
});

module.exports = mongoose.model('Folder', folderSchema);