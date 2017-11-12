let mongoose = require('mongoose');
let Folder = require('../models/folderModel');
const imagesController = require('./fileDataController')

mongoose.Promise = global.Promise;

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    }catch (e){
        console.log(e);
    }
}

async function create(img,name,size,type,location,owner,description) {
    let folder = new Folder({
        img: await imagesController.save(img),
        name: name,
        size: size,
        type: type,
        location: location,
        owner: owner,
        description: description
    });
    return new Promise((resolve,reject) =>{
        "use strict";
        folder.save(function (err, data) {
            if(err) reject(err);
            else resolve(data);
        });
    })

}

function getAll() {
    return Folder.find().exec();
}

function getById(id) {
    return Folder.findById(id).exec();
}

async function remove(id) {
    return Folder.findByIdAndRemove(id).exec();
}


function getByName(name) {
    let regExp = new RegExp('^'+name, "i");
    return Folder.find({name: regExp}).exec();
}

module.exports = {
    connect: connect,
    create: create,
    getAll: getAll,
    getById: getById,
    // update: update,
    remove: remove,
    getByName: getByName,
};