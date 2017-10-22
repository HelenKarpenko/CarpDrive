//"use strict";
let fileProcess = require('./fileProcess');
const storageName = './folders.json';

function Folder(id,img,name,size,type,location,owner,modified,created,description) {
    this.id = id;
    this.img = img;
    this.name = name;
    this.size = size;
    this.type = type;
    this.location = location;
    this.owner = owner;
    this.modified = modified;
    this.created = created;
    this.description = description;
}

function getStorage(filename){
    return fileProcess.readFromFile(filename)
        .then(data => {
            if(data.length<=2){
                return ([]);
            }else {
                return (JSON.parse(data));
            }
        })
        .catch(() => {
            return ([]); //Promise.reject(err);
        });
}
// getStorage(storageName)
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

function getCurData() {
    var month = new Array(12);
    month[0]='Jan';
    month[1]='Feb';
    month[2]='Mar';
    month[3]='Apr';
    month[4]='May';
    month[5]='Jun';
    month[6]='Jul';
    month[7]='Aug';
    month[8]='Sep';
    month[9]='Oct';
    month[10]='Nov';
    month[11]='Dec';
    let currentdate = new Date();
    return month[currentdate.getMonth()] + " "
        + currentdate.getDay() + ", "
        + currentdate.getFullYear();
}

function create(img,name,size,type,location,owner,description) {
    return getStorage(storageName)
        .then(storage => {
            let id = 1;
            if(storage.length !== 0) id = (storage[storage.length-1].id)+1;
            let created = getCurData() + ' by ' + owner;
            if(size != size) size = '-';
            let folder = new Folder(id,img,name,size,type,location,owner,created,created,description);
            storage.push(folder);
            return storage;
        })
        .then(storage => {
            return fileProcess.writeToFile(storageName, storage);
        })
}
// create('folder.png','LENA', 1, 'text', 'current', 'Kate','24.6.7', '27.08.99','krasavica')
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

//getAll() - отримати списком всі об'єкти зі сховища
function getAll() {
    return getStorage(storageName);
}
// getAll()
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

function getIndex(storage,id){
    return storage.findIndex((element) => {return element.id === Number(id);});
}
//getById(x_id) - отримати елемент зі сховища за ідентифікатором
function getById(id){
    return new Promise((resolve,reject)=> {
        getStorage(storageName)
            .then(storage =>{
                let index = getIndex(storage, id);
                if(index !== -1) resolve(storage[index]);
                else reject('Wrong id');
            });
    });
}
// getById(2)
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

function update(id, field, data) {
    return new Promise((resolve,reject)=> {
        getStorage(storageName)
            .then(storage =>{
                if (storage[0][field] === undefined || field === 'id') {
                    return reject('Wrong field');
                };
                return storage;
            })
            .then(storage => {
            let index = getIndex(storage, id);
            if(index !== -1) {
                storage[index][field] = data;
                storage[index]['modified'] = getCurData() + ' by ' + storage[index]['owner'];
                return fileProcess.writeToFile(storageName, storage);
            }
            else reject('Wrong id');
            });
    });
}
// update(1, 'name', 'AAAAAAAA')
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

function remove(id){
    return new Promise((resolve,reject)=> {
        getStorage(storageName)
            .then(storage =>{
                let index = getIndex(storage, id);
                if(index !== -1) {
                    storage.splice(index,1);
                    return fileProcess.writeToFile(storageName, storage);
                }
                else reject('Wrong id');
            });
    });
}
// remove(1)
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

module.exports = {
    create: create,
    getAll: getAll,
    getById: getById,
    update: update,
    remove: remove
};