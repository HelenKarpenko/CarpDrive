let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let itemSchema = new Schema({
    name: String,
    isFile: Boolean,
    data: Schema.Types.ObjectId,
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
    children: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Item', itemSchema);