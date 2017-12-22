let mongoose = require('mongoose');
let Folder = require('../models/folderModel');
const file = require('./fileController')
const userCtrl = require('./usersController');
const dataCtrl = require('./fileDataController')

// const MAINFOLDER = "5a3c0dddc4944e2002b978a6";

const MAINFOLDER = "5a30671f7dadbb136173ad05"
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


// async function get(folder) {
//     return new Promise((resolve, reject) => {
//         folder.getChildren(function (err,children) {
//             if(err)reject(err);
//             resolve(children);
//         })
//     });
// }

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
        folder.getChildrenTree(function (err, children) {
            if (err) reject(err);
            resolve(children);
        })
    });
}

// ???
async function getFirstChildren(id) {
    let folder = await Folder.findById(id).exec();
    if (folder) {
        return new Promise((resolve, reject) => {
            folder.getChildrenTree(function (err, children) {
                if (err) reject(err);
                resolve(children);
            })
        });
    } else {
        return new Promise.reject('Invalid id');
    }
}

async function getInfo(id) {
    return await Folder.findById(id).exec();
}

async function remove(id) {
    let folder = await Folder.findById(id).exec();
    if (!folder) {
        return {success: true}
    }
    if (folder.hasChildren) {
        let children = await getFirstChildren(id);
        for (let ch of children) {
            this.remove(ch._id);
        }
    }
    if (!folder.isFolder) {
        await dataCtrl.remove(folder.data)
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
    let path = folder.path.split('#');
    let result = [];
    for (let i = 1; i < path.length; i++) {
        folder = await Folder.findById(path[i]).exec();
        result.push({name: folder.name, id: folder._id});
    }
    // path.reverse();
    return result;
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
    if (folder.hasChildren) {
        let children = await getFirstChildren(folder._id);
        for (let ch of children) {
            let child = await create(parent, ch.name, ch.owner, ch.description);
            await copyFolderChildren(ch, child);
        }
    }
    return;
}

async function shareFolder(folder_id, user_id) {
    let user = await userCtrl.getById(user_id);
    let folder = await Folder.findById(folder_id).exec();
    let path = folder.path.split('#');
    for (let p of path) {
        if (user.sharedWithMe.children.indexOf(p) != -1) {
            return false
        }
    }
    if (user.sharedWithMe.children.indexOf(folder_id) == -1) {
        user.sharedWithMe.children.push(folder_id);
        folder.sharedWith.push(user_id);
        await user.save();
        await folder.save();
        return true;
    }
    return false;
}

async function getSharedFolder(user) {
    let folders = user.sharedWithMe.children;
    let result = [];
    for (let f_id of folders) {
        let folder = await Folder.findById(f_id).exec();
        let args = Object.assign({}, folder._doc);
        args.children = await getFirstChildren(f_id);
        result.push(args);
    }
    return result;
}

async function getShareChildren(id, user) {
    if (id == user.sharedWithMe.id) {
        let result = [];
        for (let ch of user.sharedWithMe.children) {
            result.push(await Folder.findById(ch).exec())
        }
        return result;
    } else {
        let folder = await Folder.findById(id).exec();
        if (folder) {
            return new Promise((resolve, reject) => {
                folder.getChildrenTree(function (err, children) {
                    if (err) reject(err);
                    resolve(children);
                })
            });
        } else {
            return new Promise.reject('Invalid id');
        }
    }
}

async function getSharedPath(id, user) {
    let folder = await Folder.findById(id).exec();
    let path = folder.path.split('#');
    let result = [];
    for (let i = 1; i < path.length; i++) {
        folder = await Folder.findById(path[i]).exec();
        if (user.sharedWithMe.children.indexOf(folder._id))
            result.push({name: folder.name, id: folder._id});
    }

    return result;
}

function find(query, page, limit) {
    return Folder.paginate(query, {page: Math.abs(Number(page)) || 1, limit: Math.abs(Number(limit)) || 12})
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
    getSharedFolder: getSharedFolder,
    getShareChildren: getShareChildren,
    find: find,
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
};