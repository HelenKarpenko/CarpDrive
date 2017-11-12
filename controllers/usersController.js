let mongoose = require('mongoose');
let User = require('../models/userModel');
let folderCtrl = require('./folderController');

mongoose.Promise = global.Promise;

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    }catch (e){
        console.log(e);
    }
}

async function create(name,username,password,isAdmin) {
    let user = new User({
        name: name,
        username: username,
        password: password,
        isAdmin: isAdmin,
        folders: []
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

function addFolder(id, folderId) {
    User.findById(id).exec()
        .then(user => {
            user.folders.push(folderId);
            return user.save();
        })
        .catch(err=>console.log(err));
}

async function getAllFolder(id) {
    try{
        let user = await User.findById(id).exec();
        console.log(user);
        let allFolders = [];
        for (let fid of user.folders) {
            // console.log(fid);
            allFolders.push(folderCtrl.getById(fid));
        }
        return Promise.all(allFolders);
    }catch(err){
            console.log(err);
            return []
    }
}

module.exports = {
    connect: connect,
    create: create,
    getAll: getAll,
    getById: getById,
    remove: remove,
    getByName: getByName,
    getByUsername: getByUsername,
    addFolder: addFolder,
    getAllFolder: getAllFolder
};