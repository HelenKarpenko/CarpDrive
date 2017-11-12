let mongoose = require('mongoose');
let Item = require('../models/itemModel');
const fileController = require('./fileDataController')

mongoose.Promise = global.Promise;

function connect(url) {
    try {
        return mongoose.connect(url, {useMongoClient: true});
    }catch (e){
        console.log(e);
    }
}

async function create(name,data,isFile,owner,description, parent) {
    let item = new Item({
        name: name,
        isFile: isFile,
        data: await fileController.save(data),
        owner: owner,
        sharedWithMe: [],
        info: {description: description},
        parent: mongoose.Types.ObjectId(parent),
        children: [],
    });
    return new Promise((resolve,reject) =>{
        item.save(function (err, data) {
            if(err) reject(err);
            else resolve(data);
        });
    });
}

function getAll() {
    return Item.find().exec();
}

function getById(id) {
    return Item.findById(id).exec();
}

async function remove(id) {
    return Item.findByIdAndRemove(id).exec();
}

function getByName(name) {
    let regExp = new RegExp('^'+name, "i");
    return Item.find({name: regExp}).exec();
}


function addChild(id, childId) {
    Item.findById(id).exec()
        .then(item => {
                item.children.push(mongoose.Types.ObjectId(childId));
            return item.save();
        })
        .catch(err => console.log(err));
}

async function getAllChildren(id) {
    try{
        let item = await Item.findById(id).exec();
        let allChildren = [];
        for (let fid of item.children) {
            let child=await Item.findById(fid).exec();
            if(child){
            allChildren.push(child);
            }
        }
        return Promise.all(allChildren);
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
    addChild: addChild,
    getAllChildren: getAllChildren,
};