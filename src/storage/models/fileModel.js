let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fileDataController=require('../controllers/fileDataController');

let fileSchema = new Schema({
    name: String,
    data: Schema.Types.ObjectId,
    // owner: String,
    owner: Schema.Types.ObjectId,
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
    isFile: Boolean,
});

fileSchema.pre('remove',async function (next) {
    await fileDataController.remove(this.data);
    next();
});

module.exports = mongoose.model('File', fileSchema);