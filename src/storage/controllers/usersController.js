let mongoose = require('mongoose');
let User = require('../models/userModel');
const folderCtrl = require('./folderController');

mongoose.Promise = global.Promise;

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    }catch (e){
        console.log(e);
    }
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
    console.log("*****")
    console.log(user);
    console.log(folderId);
    user.myDrive = folderId;
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

//////////////////////
async function create(name, username ,password) {
    console.log(2)
    let user = new User({
        name: name,
        username: username,
        password: password,
    });
    console.log(1)
    return user.save();
}

let get = {
    async byCredentials(username, password) {
        const user = await User.findOne({username: username});
        console.log(user);
        if(user && user.comparePassword(password)){
            return user;
        }
        return null;
    },
    async byAccessToken (token) {
        const user = await User.findOne({'tokens.access.value': token})
        if(user && user.verifyAccessToken(token)){
            return user;
        }
        return null;
    },
    async byRefreshToken (token) {
        const user = await User.findOne({'tokens.refresh.value': token})
        if(user && user.verifyRefreshToken(token)){
            return user;
        }
        return null;
    }
}

//////////////////////

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
    //////
    get: get,
    //////
};