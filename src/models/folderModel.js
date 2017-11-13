let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let file=require('../controllers/fileController');


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

folderSchema.methods.removeChild=function (child) {
    console.log('remove child call',this.id);

    let index=this.children.folders.indexOf(child);
    if(index>=0){
        this.children.folders.splice(index,1);
    }
}
folderSchema.methods.removeFiles = async function () {
    console.log('remove files call',this.id,this.name);

    let childs = []
    for (let fid of this.children.files) {
        child = await file.getById(fid);
        if(child){
            childs.push(child.remove());
        }
    }
    this.children.files = [];
    await this.save();
    return Promise.all(childs);
}

folderSchema.methods.removeFolders=async function () {
    const folder_c = require('../controllers/folderController');

    console.log('remove folders call',this.id,this.name);

    let childs = []
    for (let fid of this.children.folders) {
        child = await folder_c.getById(fid);
        if(child){
            childs.push(child.remove());
        }
    }
    this.children.folders = [];
    await this.save();
    console.log('removed folders from',this.id,this.name);
    return Promise.all(childs);
}
folderSchema.methods.clean=async function () {
    console.log('clean call',this.id,this.name);
    await this.removeFolders();
    await this.removeFiles();
    console.log('cleaned ',this.id,this.name);
}

folderSchema.methods.delete=async function () {
    //
    // console.log('delete call',this.id, this.name);
    //
    // await this.clean();
    // console.log('deleted',this.id, this.name);

}
folderSchema.pre('remove',async function (next) {
    console.log('remove call',this.id,this.name);
    await this.clean();
    console.log('removed ',this.id,this.name);
    next();
})

module.exports = mongoose.model('Folder', folderSchema);