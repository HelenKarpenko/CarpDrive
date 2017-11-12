const mongoose = require('mongoose');
const fileType = require("file-type");
const gridfsStream = require('gridfs-stream');
const stream = require('stream');
const Folder = require('../models/folderModel')

const imageAllowedTypes = ["png", "jpg", "jpeg", "gif"];
const imgFolder = 'images';

let images;

function connect() {
    try {
        images = gridfsStream(mongoose.connection.db, mongoose.mongo);
        images.collection('images');
    } catch (e) {
        console.log(e);
    }
}

function isImage(file) {
    try {
        return imageAllowedTypes.indexOf(fileType(file.data).ext) !== -1;
    } catch (e) {
        return false;
    }
}

function save(file) {
    return new Promise(async (resolve, reject) =>
    {
        if (!isImage(file)) {
            reject("File is not an image file");
        }
        let ext = fileType(file.data).ext;
        var bufferStream = new stream.PassThrough();
        bufferStream.end(file.data);
        //create stream to db
        let id = new mongoose.Types.ObjectId;
        let writeStream = images.createWriteStream(
            {
                filename: file.name,
                _id: id,
                mode: 'w',
                chunkSize: 16384,
                content_type: `image/${ext}`,
                root: imgFolder,
                createdOn: Date.now()
            });
        if (await bufferStream.pipe(writeStream)) {
            console.log(`+IMAGE SAVED ${id}`);
            resolve(id);
        } else {
            reject("Cannot write to db");
        }
    });
}

function saveImage(file) {
    return new Promise(async (resolve, reject) =>
    {
        if (!isImage(file)) {
            reject("File is not an image");
        }

        var fileModel = new File({ });
        post.image.data = fs.readFileSync(req.file.path);
        post.image.contentType='image/png';

        let ext = fileType(file.data).ext;
        var bufferStream = new stream.PassThrough();
        bufferStream.end(file.data);
        //create stream to db
        let id = new mongoose.Types.ObjectId;
        let writeStream = images.createWriteStream(
            {
                filename: file.name,
                _id: id,
                mode: 'w',
                chunkSize: 16384,
                content_type: `image/${ext}`,
                root: imgFolder,
                createdOn: Date.now()
            });
        if (await bufferStream.pipe(writeStream)) {
            console.log(`+IMAGE SAVED ${id}`);
            resolve(id);
        } else {
            reject("Cannot write to db");
        }
    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        images.findOne({_id: id, root: imgFolder},
            async (err, file) => {
                try {
                    if (err) {
                        console.log(`ERROR FIND IMAGE ${id}`);
                        reject(err);
                    } else if (file === null) {
                        console.log(`-FIND IMAGE ${id}`);
                        reject("Wrong id");
                    } else {
                        file.stream = getData(id);
                        console.log(`+FIND IMAGE ${id}`);
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
        images.remove({_id: id, root: imgFolder}, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

function getData(id) {
    return images.createReadStream({_id: id, root: imgFolder});
}

module.exports = {
    connect: connect,
    save: save,
    remove: remove,
    getById: getById
};