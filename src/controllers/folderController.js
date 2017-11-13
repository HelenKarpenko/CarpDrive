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

// async function getAllChildren(id) {
//     try{
//         let folder = await Folder.findById(id).exec();
//         let allChildren = [];
//         let child;
//         for (let fid of folder.children.folders) {
//             child = await Folder.findById(fid).exec();
//                 if(child){
//                     allChildren.push(child);
//                 }
//         }
//         for (let fid of folder.children.files) {
//             child = await file.getById(fid);
//             if(child){
//                 allChildren.push(child);
//             }
//         }
//         return allChildren;
//     }catch(err){
//         console.log(err);
//         return []
//     }
// }

async function remove(id) {
    let folder = await Folder.findById(id);
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
}

async function removeAll(id) {
    let folder = await Folder.findById(id).exec();
    if(folder){
        return folder.clean();
    }

}

async function removeAllFiles(folder) {
    return folder.removeFiles();
}

async function getAllFiles(folder) {
    return folder.getAllFile();
}

async function getAllChildren(id) {
    let folder = await Folder.findById(id).exec();
    if(folder){
        return folder.getAllChildren();
    }

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