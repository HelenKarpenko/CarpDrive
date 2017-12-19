let mongoose = require('mongoose');
let Folder = require('../models/folderModel');
const file = require('./fileController')
const userCtrl = require('./usersController');

const MAINFOLDER = '5a30671f7dadbb136173ad05';

mongoose.Promise = global.Promise;

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    } catch (e) {
        console.log(e);
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getMyDrive(id) {
    return Folder.findById(id).exec();
}


async function get(folder, args) {
    args = {
        filters: {},
        minLevel: 1,
        recursive: true,
        allowEmptyChildren: false
    }
    return new Promise((resolve, reject) => {
        folder.getChildren(function (err,children) {
            if(err)reject(err);
            resolve(children);
        })
    });
}

async function create(parent, name, owner, description) {

    let folder = new Folder({
        name: name,
        hasChildren: false,
        isFolder: true,
        data: null,
        owner: mongoose.Types.ObjectId(owner),
        sharedWithMe: [],
        info: {description: description},
    });

    folder.parent = parent;
    parent.hasChildren = true;

    await parent.save();
    return folder.save();
}

async function getAllChildren(id) {
    let folder = await Folder.findById(id).exec();
    return new Promise((resolve, reject) => {
        folder.getChildrenTree(function (err,children) {
            if(err)reject(err);
            resolve(children);
        })
    });
}
// ???
async function getFirstChildren(id) {
    let folder = await Folder.findById(id).exec();
    if(folder){
        return new Promise((resolve, reject) => {
            folder.getChildrenTree(function (err,children) {
                if(err)reject(err);
                resolve(children);
            })
        });
    }else{
        return new Promise.reject('Invalid id');
    }
}
async function getInfo(id) {
    return await Folder.findById(id).exec();
}

async function remove(id) {
    let folder = await Folder.findById(id).exec();
    if(!folder){
        return {success: true}
    }
    if(folder.hasChildren) {
        let children = await getFirstChildren(id);
        for (let ch of children) {
            this.remove(ch._id);
        }
    }
    return Folder.findByIdAndRemove(id).exec();
}

async function getMainFolder() {
    return Folder.findById(MAINFOLDER);
}

async function rename(id, newName) {
    return Folder.update({_id: id}, {name: newName}).exec();
}

async function getPath(id) {
    let folder = await Folder.findById(id).exec();
    let path = [];
    while(folder._id != MAINFOLDER){
        path.push(folder.name);
        folder = await Folder.findById(folder.parent).exec();
    }
    path.reverse();
    return path;
}

// COPY
async function copyFolder(id) {
    let folder = await Folder.findById(id).exec();
    let parent = await Folder.findById(folder.parent).exec();
    let copy = await this.create(parent, folder.name, folder.owner, folder.description);
    await copyFolderChildren(folder, copy);

    return copy;
}
async function copyFolderChildren(folder, parent) {
    if(folder.hasChildren) {
        let children = await getFirstChildren(folder._id);
        for (let ch of children) {
            let child = await create(parent, ch.name, ch.owner, ch.description);
            await copyFolderChildren(ch, child);
        }
    }
    return;
}

async function shareFolder(folder_id, user_id) {
    console.log("SHARED")
    let user = await userCtrl.getById(user_id);
    let folder = await Folder.findById(folder_id).exec();
    if(user.sharedWithMe.indexOf(folder_id) == -1) {
        user.sharedWithMe.push(folder_id);
        folder.sharedWith.push(user_id);
        await user.save();
        await folder.save();
        return true;
    }
    return false;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = {
    connect: connect,
    create: create,
    // getAll: getAll,
    // getById: getById,
    // remove: remove,
    // getByName: getByName,
    // addChild: addChild,
    // getAllChildrenJSON: getAllChildrenJSON,
    // removeAllFiles: removeAllFiles,
    // removeAll: removeAll,
    // getAllItems: getAllItems,
    // find: find,
    // get:get,

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getMyDrive: getMyDrive,
    getAllChildren: getAllChildren,
    getChildren: getFirstChildren,
    getInfo: getInfo,
    remove: remove,
    getMainFolder: getMainFolder,
    rename: rename,
    getPath: getPath,
    copyFolder: copyFolder,
    shareFolder: shareFolder,
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
};