const mongoose = require('mongoose');
const fileType = require("file-type");
const gridfsStream = require('gridfs-stream');
const stream = require('stream');

let fileModel;
const folder = 'fs';

function connect() {
    try {
        fileModel = gridfsStream(mongoose.connection.db, mongoose.mongo);
        fileModel.collection('files');
    } catch (e) {
        console.log(e);
    }
}

function save(file) {
    return new Promise(async (resolve, reject) =>
    {
        let ext = fileType(file.data).ext;
        var bufferStream = new stream.PassThrough();
        bufferStream.end(file.data);
        //create stream to db
        let writeStream = fileModel.createWriteStream(
            {
                filename: file.name,
                mode: 'w',
                content_type: `image/${ext}`,
                root: folder,
            });
        if (await bufferStream.pipe(writeStream)) {
            console.log(`+IMAGE SAVED ${writeStream.id}`);
            resolve(writeStream.id);
        } else {
            reject("Cannot write to db");
        }
    });
}


function getById(id) {
    return new Promise((resolve, reject) => {
        fileModel.findOne({_id: id, root: folder},
            async (err, file) => {
                try {
                    if (err) {
                        //console.log(`ERROR FIND IMAGE ${id}`);
                        reject(err);
                    } else if (file === null) {
                        //console.log(`-FIND IMAGE ${id}`);
                        reject("Wrong id");
                    } else {
                        file.stream = getData(id);
                        //console.log(`+FIND IMAGE ${id}`);
                        resolve(file);
                    }
                } catch (e) {
                    reject(e);
                }
            });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        fileModel.remove({_id: id, root: folder}, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

function getData(id) {
    return fileModel.createReadStream({_id: id, root: folder});
}

module.exports = {
    connect: connect,
    save: save,
    remove: remove,
    getById: getById
};