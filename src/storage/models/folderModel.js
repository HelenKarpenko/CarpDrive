let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
var mongooseTree = require('mongoose-path-tree');

let Schema = mongoose.Schema;

let folderSchema = new Schema({
    name: String,
    isFolder: Boolean,
    data: Schema.Types.ObjectId,
    hasChildren: Boolean,
    owner: Schema.Types.ObjectId,
    sharedWith: [
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
    children: {
        type: [Schema.Types.ObjectId],
        default: [],
    }

});

folderSchema.plugin(mongoosePaginate);
folderSchema.plugin(mongooseTree, {
    pathSeparator : '#',
    onDelete : 'REPARENT',
    numWorkers: 5,
    idType: Schema.ObjectId,
});

module.exports = mongoose.model('Folder', folderSchema);