//"use strict";
let fileProcess = require('./fileProcess');
const storageName = 'folders.json';

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
    return new Promise((resolve)=> {
        fileProcess.readFromFile(filename)
            .then(data => {
                if(data.length<=2){
                    resolve([]);
                }else {
                    resolve(JSON.parse(data));
                }
            })
            .catch(() => {
                resolve([]); //Promise.reject(err);
            });
    });
}
// getStorage(storageName)
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

function create(img,name,size,type,location,owner,modified,created,description) {
    return new Promise((resolve,reject)=> {
        let folder;
        getStorage(storageName)
            .then(storage => {
                let id = 1;
                if(storage.length !== 0) id = (storage[storage.length-1].id)+1;
                folder = new Folder(id,img,name,size,type,location,owner,modified,created,description);
                storage.push(folder);
                return storage;
            })
            .then(storage => {
                return fileProcess.writeToFile(storageName, storage);
            })
            .then(() => {
                resolve(folder);
            })
            .catch(err => reject(err));
    });
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
// getById(99)
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

function update(id, field, data) {
    return new Promise((resolve,reject)=> {
        getStorage(storageName)
            .then(storage =>{
                if (storage[0][field] === "undefined" || field === 'id') {
                    return reject('Wrong field');
                };
                return storage;
            })
            .then(storage => {
            let index = getIndex(storage, id);
            if(index !== -1) {
                storage[index][field] = data;
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