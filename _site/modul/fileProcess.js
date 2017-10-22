//"use strict";
let fs = require('fs');

function readFromFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if(err) reject(err);
            else resolve(data.toString());
        });
    });
}

function writeToFile(filename, data) {
    return new Promise((resolve, reject) => {
        let str = JSON.stringify(data);
        fs.writeFile(filename, str, (err)=> {
            if(err) reject(err);
            else resolve(JSON.stringify(str));
        });
    });
}

module.exports = {
    readFromFile: readFromFile,
    writeToFile: writeToFile
};