let mongoose = require('mongoose');
let Folder = require('../models/folderModel');
const file = require('./fileController')

mongoose.Promise = global.Promise;

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    }catch (e){
        console.log(e);
    }
}

async function create(name,owner,description, parent) {
    let folder = new Folder({
        name: name,
        owner: owner,
        sharedWithMe: [],
        info: {description: description},
        // parent: null,
        parent: mongoose.Types.ObjectId(parent),
        children: {
            folders: [],
            files: []
        },
    });
    return new Promise((resolve,reject) =>{
        folder.save(function (err, data) {
            if(err) reject(err);
            else resolve(data);
        });
    });
}

function getAll() {
    return Folder.find().exec();
}

function getById(id) {
    return Folder.findById(id).exec();
}

async function remove(id) {
    let folder=await Folder.findById(id);
    if(folder){
        let folders=[];
        for(let childid of folder.children.folders){
            console.log('child',childid);
            folders.push(remove(childid))
        }
        await Promise.all(folders);

        let files=[];
        for(let childid of folder.children.files){
            console.log('child',childid);
            folders.push(File.remove(childid))
        }
        await Promise.all(files);

    }
    // Folder.findById(id)
    //     .then(folder => {
    //         Folder.findById(folder.parent)
    //             .then(parent => parent.children.folder)
    //     })
    //     .catch(err => console.log("REMOVE : "+err))
    // return Folder.findByIdAndRemove(id).exec();
}

function getByName(name) {
    let regExp = new RegExp('^'+name, "i");
    return Folder.find({name: regExp}).exec();
}


function addChild(id, childId, isFile) {
    Folder.findById(id).exec()
        .then(folder => {
            if(isFile){
                folder.children.files.push(mongoose.Types.ObjectId(childId));
            }else{
                folder.children.folders.push(mongoose.Types.ObjectId(childId));
            }
            return folder.save();
        })
        .catch(err => console.log(err));
}

async function getAllChildren(id) {
    try{
        let folder = await Folder.findById(id).exec();
        let allChildren = [];
        let child;
        for (let fid of folder.children.folders) {
            child = await Folder.findById(fid).exec();
                if(child){
                    allChildren.push(child);
                }
        }
        for (let fid of folder.children.files) {
            child = await file.getById(fid);
            if(child){
                allChildren.push(child);
            }
        }
        return allChildren;
    }catch(err){
        console.log(err);
        return []
    }
}

async function removeAll(id) {
    console.log("++++++");

    let folder = await Folder.findById(id).exec();
    if(folder){
        return folder.clean();
    }
    // if(folder) {
    //     await removeAllFiles(folder);
    //     for (let f of folder.children.folders) {
    //         console.log("REMOVE."+ f._id +" "+ f.name);
    //         this.removeAll(f._id);
    //     }
    //     return remove(id);
    // }

}


async function removeAllFiles(folder) {
    return folder.removeFiles();
}


module.exports = {
    connect: connect,
    create: create,
    getAll: getAll,
    getById: getById,
    remove: remove,
    getByName: getByName,
    addChild: addChild,
    getAllChildren: getAllChildren,
    removeAllFiles: removeAllFiles,
    removeAll: removeAll,
};