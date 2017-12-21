let mongoose = require('mongoose');
const dataCtrl = require('./fileDataController')
let File = require('./../models/folderModel');

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    }catch (e){
        console.log(e);
    }
}

async function create(parent, name, owner, data, description) {
    let file = new File({
        name: name,
        hasChildren: false,
        isFolder: false,
        data: await dataCtrl.save(data),
        owner: mongoose.Types.ObjectId(owner),
        sharedWithMe: [],
        info: {description: description},
    });

    file.parent = parent;
    parent.hasChildren = true;

    await parent.save();
    return file.save();
}

function getAll() {
    return File.find().exec();
}

async function getById(id) {
    return File.findById(id).exec();
}

async function remove(id, parent) {
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