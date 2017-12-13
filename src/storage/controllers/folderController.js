let mongoose = require('mongoose');
let Folder = require('../models/folderModel');
const file = require('./fileController')

mongoose.Promise = global.Promise;

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    } catch (e) {
        console.log(e);
    }
}

// async function create(name,owner,description, parent) {
//     let folder = new Folder({
//         name: name,
//         owner: mongoose.Types.ObjectId(owner),
//         sharedWithMe: [],
//         info: {description: description},
//         parent: mongoose.Types.ObjectId(parent),
//         children: {
//             folders: [],
//             files: []
//         },
//     });
//     return new Promise((resolve,reject) =>{
//         folder.save(function (err, data) {
//             if(err) reject(err);
//             else resolve(data);
//         });
//     });
// }


function getAll() {
    return Folder.find().exec();
}

function getById(id) {
    return Folder.findById(id).exec();
}

function getByName(name, owner) {
    let regExp = new RegExp('^' + name, "i");
    return Folder.find({
        name: regExp,
        owner: owner,
    }).exec();
}

function addChild(id, childId, isFile) {
    Folder.findById(id).exec()
        .then(folder => {
            if (isFile) {
                folder.children.files.push(mongoose.Types.ObjectId(childId));
            } else {
                folder.children.folders.push(mongoose.Types.ObjectId(childId));
            }
            return folder.save();
        })
        .catch(err => console.log(err));
}

async function getAllItems(id) {
    try {
        let folder = await Folder.findById(id).exec();
        let allChildren = [];
        let child;
        for (let fid of folder.children.folders) {
            child = await Folder.findById(fid).exec();
            if (child) {
                allChildren.push(child);
            }
        }
        for (let fid of folder.children.files) {
            child = await file.getById(fid);
            if (child) {
                allChildren.push(child);
            }
        }
        return allChildren;
    } catch (err) {
        console.log(err);
        return []
    }
}

async function remove(id) {
    let folder = await Folder.findById(id).exec();
    let parent = await Folder.findById(folder.parent).exec();
    let index = parent.children.folders.indexOf(id)
    if (index >= 0) parent.children.folders.splice(index, 1);
    await parent.save();
    return folder.remove(id);
}

async function removeAll(id) {
    let folder = await Folder.findById(id).exec();
    if (folder) {
        return folder.clean();
    }

}

async function removeAllFiles(folder) {
    return folder.removeFiles();
}

async function getAllFiles(folder) {
    return folder.getAllFiles();
}

async function getAllChildrenJSON(id) {
    let folder = await Folder.findById(id).exec();
    if (folder) {
        return folder.getAllChildren();
    }
}

function find(query, page, limit) {
    return Folder.paginate(query, {page: Math.abs(Number(page)) || 1, limit: Math.abs(Number(limit)) || 12})
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getMyDrive(id) {
    return Folder.findById(id).exec();
}

// let get = {
//     async  (token)
// }

async function get(folder, args) {
    args = {
        filters: {},
        minLevel: 1,
        recursive: true,
        allowEmptyChildren: false
    }
    return new Promise((resolve, reject) => {
        folder.getChildrenTree(function (err,children) {
            if(err)reject(err);
            resolve(children);
        })
    });
}

async function create(parent, name) {

    let folder = new Folder({
        name: name,
        hasChildren: false,
    });

    folder.parent = parent;
    if(parent){
        folder.parent = parent;
        parent.hasChildren = true;
        await parent.save();
    }
    return await folder.save();
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
            folder.getChildren(function (err,children) {
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
    console.log('ENTER. '+ folder.name +' '+ folder._id);
    if(!folder){
        console.log('EXIT.');
        return {success: true}
    }
    if(folder.hasChildren) {
        console.log('HAS CHILDREN.');
        let children = await getFirstChildren(id);
        console.log('CHILDREN: ' + children);
        for (let ch of children) {
            this.remove(ch._id);
        }
    }
    console.log('REMOVE '+ folder.name +' '+ folder._id);
    return Folder.findByIdAndRemove(id).exec();
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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
};