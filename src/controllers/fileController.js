let mongoose = require('mongoose');
let File = require('../models/fileModel');
const fileController = require('./fileDataController')

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
        data: await fileController.save(data),
        owner: owner,
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

function getById(id) {
    return File.findById(id).exec();
}

async function remove(id) {
    console.log('remove',id);
    let file= await getById(id);
    if(file)
    return file.remove();
}

function getByName(name) {
    let regExp = new RegExp('^'+name, "i");
    return File.find({name: regExp}).exec();
}

module.exports = {
    connect: connect,
    create: create,
    getAll: getAll,
    getById: getById,
    remove: remove,
    getByName: getByName,
};