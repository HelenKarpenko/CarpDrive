let mongoose = require('mongoose');
let File = require('../models/fileModel');
const dataCtrl = require('./fileDataController')

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
        sharedWithMe: [],
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
    console.log('remove',id);
    let index = parent.children.files.indexOf(id)
    if(index >= 0) parent.children.files.splice(index, 1);
    let file = await getById(id);
    if(file)
    return file.remove();
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



module.exports = {
    connect: connect,
    create: create,
    getAll: getAll,
    getById: getById,
    remove: remove,
    getByName: getByName,
    getData: getData,
    getByName: getByName,
};