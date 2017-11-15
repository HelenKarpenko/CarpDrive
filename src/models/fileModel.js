let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fileDataController=require('../controllers/fileDataController');
let userController = require('../controllers/usersController');

let fileSchema = new Schema({
    name: String,
    data: Schema.Types.ObjectId,
    // owner: String,
    owner: Schema.Types.ObjectId,
    sharedWith : [Schema.Types.ObjectId],
    info: {
        modified: {type: Date, default: Date.now},
        created: {type: Date, default: Date.now},
        description: String,
    },
    parent: Schema.Types.ObjectId,
    isFile: Boolean,
});

fileSchema.pre('remove',async function (next) {
    // try {
    //     console.log('remove', this.name);
    //     await fileDataController.remove(this.data);
    //     let arr = this.sharedWith;
    //     this.sharedWith = [];
    //     await this.save();
    //     for (let f of arr) {
    //         console.log('REMOVE ' + f +" "+ this._id);
    //         await userController.removeSharedFile(f, this._id);
    //     }
    //     console.log("заработай йобаная сука");
        next();
    // }catch(e){
    //     console.log("!!!! "+e);
    //     next();
    // }
});

module.exports = mongoose.model('File', fileSchema);