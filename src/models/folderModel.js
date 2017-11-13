let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let file = require('../controllers/fileController');

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

folderSchema.methods.removeChild = function (child) {
    console.log('remove child call',this.id);
    let index = this.children.folders.indexOf(child);
    if(index >= 0){
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
folderSchema.methods.removeFolders = async function () {
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
folderSchema.methods.clean = async function () {
    console.log('clean call',this.id,this.name);
    await this.removeFolders();
    await this.removeFiles();
    console.log('cleaned ',this.id,this.name);
}
folderSchema.pre('remove',async function (next) {
    console.log('remove call',this.id,this.name);
    await this.clean();
    console.log('removed ',this.id,this.name);
    next();
})

//1 method get childrens [{..},{..}]
folderSchema.methods.getAllFiles = async function () {
    console.log('get all FILES',this.id,this.name);
    let children_ids = [];
    //collect promises
    this.children.files.forEach((fid)=> children_ids.push(file.getById(fid)));
    //run promises
    let child_files=await Promise.all(children_ids);

    let children=[];
    child_files.forEach((file_child)=>{
        if(file_child){
            children.push({
                name:file_child.name,
                id:file_child.id,
                type:'file'
            });
        }
    });

    return children;
}

folderSchema.methods.getAllFolders = async function () {
    const folder_c = require('../controllers/folderController');
    console.log('get all FOLDER',this.id,this.name);
    let children_ids = [];
    //collect promises
    this.children.folders.forEach((fid)=> children_ids.push(folder_c.getById(fid)));
    //run promises
    let child_folders=await Promise.all(children_ids);
    //get new trees
    let child_trees_promise=[];
    //push promise to array
    child_folders.forEach((folder)=> child_trees_promise.push(folder.getAllChildren()));
    //collect sub trees of each child-folder
    let child_trees=await Promise.all(child_trees_promise);
    //collect this children
    // let children=[];
    // child_trees.forEach((folder_child,i)=>{
    //     if(folder_child){
    //         children.push({
    //
    //             items:child_trees[i]
    //         });
    //     }
    // });

    return child_trees;
    // let children = [];
    // for(let fid of this.children.folder){
    //     child = await folder_c.getById(fid);
    //     if(child){
    //         children.push({
    //             isFile: false,
    //             data: child
    //         });
    //     }
    // }
    // return Promise.all(children);
}


folderSchema.methods.getAllChildren = async function () {
    console.log('getAll call',this.id,this.name);
    let promises=[this.getAllFolders(),this.getAllFiles()];
    console.log(promises);
    let result=await Promise.all(promises);

    let items=result[0].concat(result[1]);
    return {
        name:this.name,
        id:this.id,
        type:'folder',
        items:items
    };
}
//2 method get child {type:.., items:[]}


module.exports = mongoose.model('Folder', folderSchema);