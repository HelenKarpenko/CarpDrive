let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let folderSchema = new Schema({
    name: String,
    owner: String,
    // owner: Schema.Types.ObjectId,
    sharedWith : [
        {
            user: Schema.Types.ObjectId,
            AccessLevel: String,
        }
    ],
    info: {
        modified: {type: Date, default: Date.now},
        created: {type: Date, default: Date.now},
        description: String,
    },
    parent: Schema.Types.ObjectId,
    children: {
        folders: [Schema.Types.ObjectId],
        files: [Schema.Types.ObjectId]
    }
});

module.exports = mongoose.model('Folder', folderSchema);