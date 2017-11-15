let mongoose = require('mongoose');
let File = require('../models/fileModel');
const dataCtrl = require('./fileDataController')
let userController = require('../controllers/usersController');

mongoose.Promise = global.Promise;

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    }catch (e){
        console.log(e);
    }
}

async function create(name,data,owner,description, parent) {
    let file = new File({
        name: name,
        data: await dataCtrl.save(data),
        owner: mongoose.Types.ObjectId(owner),
        sharedWith: [],
        info: {description: description},
        parent: mongoose.Types.ObjectId(parent),
        isFile: true
    });
    return new Promise((resolve,reject) =>{
        file.save(function (err, data) {
            if(err) reject(err);
            else resolve(data);
        });
    });
}

function getAll() {
   return File.find().exec();
}

async function getById(id) {
    return File.findById(id).exec();
}

async function remove(id, parent) {
    try {
        console.log('remove',id);
        let file = await getById(id);
        await dataCtrl.remove(file.data);
        let arr = file.sharedWith;
        file.sharedWith = [];
        await file.save();
        for (let f of arr) {
            console.log('REMOVE ' + f +" "+ file._id);
            userController.removeSharedFile(f, file._id)
                .then()
        }
        console.log("заработай йобаная сука");
    }catch(e){
        console.log("!!!! "+e);
    }
}

function getByName(name, owner) {
    let regExp = new RegExp('^'+name, "i");
    return File.find({
        name: regExp,
        owner: owner,
    }).exec();
}

async function getData(id){
    let file = await getById(id);
    return dataCtrl.getById(file.data);
}



async function addShare(userId, fileId) {
    console.log("File SHARE WITH ME "+ userId +" "+ fileId);
    let file = await getById(fileId);
    file.sharedWith.push(userId)
    return file.save();
}


module.exports = {
    connect: connect,
    create: create,
    getAll: getAll,
    getById: getById,
    remove: remove,
    getByName: getByName,
    getData: getData,
    getByName: getByName,
    addShare: addShare,
};