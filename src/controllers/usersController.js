let mongoose = require('mongoose');
let User = require('../models/userModel');

mongoose.Promise = global.Promise;

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    }catch (e){
        console.log(e);
    }
}

async function create(name,login,password) {
    let user = new User({
        name: name,
        login: login,
        password: password,
        folder: null,
        folders: [],
        sharedWithMe: {
            folders:[],
            files:[],
        },
    });
    return user.save();
}

function getAll() {
    return User.find().exec();
}

function getById(id) {
    return User.findById(id).exec();
}

function remove(id) {
    return User.findByIdAndRemove(id).exec();
}

function getByName(name) {
    let regExp = new RegExp('^'+name, "i");
    return User.find({name: regExp}).exec();
}

function getByUsername(username) {
    return User.find({username: username}).exec();
}

function getByLogin(login) {
    return User.find({login: login}).exec();
}

async function addMainFolder(user, folderId) {
    user.folder = folderId;
    return user.save();
}

function addFolder(id, folderId) {
    User.findById(id).exec()
        .then(user => {
            user.folders.push(folderId);
            return user.save();
        })
        .catch(err=>console.log(err));
}

async function addShareFile(userId, fileId) {
    console.log("SHARE WITH ME "+ userId +" "+ fileId);
    let user = await getById(userId);
    user.sharedWithMe.files.push(fileId);
    return user.save();
}

async function addShareFolder(userId, folderId) {
    let user = await getById(userId);
    user.sharedWithMe.files.push(folderId);
    return user.save();
}

async function getAllFolder(id) {
    try{
        let user = await User.findById(id).exec();
        console.log(user);
        let allFolders = [];
        for (let fid of user.folders) {
            allFolders.push(folderCtrl.getById(fid));
        }
        return Promise.all(allFolders);
    }catch(err){
            console.log(err);
            return []
    }
}

async function removeSharedFile(userId,fileId) {
    let user = await this.getById(userId);
    let index = user.sharedWithMe.files.indexOf(fileId);
    console.log("removeSharedFile: before= " + user.sharedWithMe.files);
    console.log("removeSharedFile: index= " + index+" id= " + fileId);
    if(index >= 0) user.sharedWithMe.files.splice(index, 1)
    console.log("removeSharedFile: after= " + user.sharedWithMe.files);

    return await user.save();
}

module.exports = {
    connect: connect,
    create: create,
    getAll: getAll,
    getById: getById,
    remove: remove,
    getByName: getByName,
    getByLogin: getByLogin,
    getByUsername: getByUsername,
    addFolder: addFolder,
    getAllFolder: getAllFolder,
    addMainFolder: addMainFolder,
    addShareFile: addShareFile,
    addShareFolder: addShareFolder,
    removeSharedFile: removeSharedFile,
};