let mongoose = require('mongoose');
let User = require('../models/userModel');
const folderCtrl = require('./folderController');
const dataCtrl = require('./fileDataController')
const ObjectId = require('mongoose').Types.ObjectId;

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
    return User.findOne({username: username}).exec();
}

function getByLogin(login) {
    return User.find({login: login}).exec();
}

async function addMainFolder(user, folderId) {
    user.myDrive = folderId;
    return user.save();
}

async function addSharedFolder(user, folderId) {
    user.sharedWithMe = folderId;
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
    let user = new User({
        name: name,
        username: username,
        password: password,
        sharedWithMe: {
            id: new ObjectId(),
            children: [],
        }
    });
    return user.save();
}

let get = {
    async byCredentials(username, password) {
        if(!username|| username.length==0) return null;
        const user = await User.findOne({username: username});
        // console.log(user);
        if(user && user.comparePassword(password)){
            return user;
        }
        return null;
    },
    async byAccessToken (token) {
        if(!token || token.length==0) return null;
        const user = await User.findOne({'tokens.access.value': token})
        if(user && user.verifyAccessToken(token)){
            return user;
        }
        return null;
    },
    async byRefreshToken (token) {
        if(!token || token.length==0) return null;
        const user = await User.findOne({'tokens.refresh.value': token})
        if(user && user.verifyRefreshToken(token)){
            return user;
        }
        return null;
    }
}

async function setAvatar(id, avatar) {
    let user = await User.findById(id).exec();
    let ava = await dataCtrl.save(avatar)
    user.avatar = ava;
    return user.save();
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
    addSharedFolder: addSharedFolder,
    //////
    get: get,
    setAvatar: setAvatar,
    //////
};