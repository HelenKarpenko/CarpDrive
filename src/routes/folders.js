// var express = require('express');
// var router = express.Router();
//
// const folderCtrl = require('../controllers/folderController');
// const fileCtrl = require('../controllers/fileController');
// const imgCtrl = require('../controllers/fileDataController');
// // const userCtrl = require('../controllers/usersController');
// const utilties = require('../utilities/utilities');
//
// router.get('/', function (req, res, next) {
//     Promise.all([
//         fileCtrl.getAll(),
//         folderCtrl.getAll()
//     ])
//         .then(([files, folders]) => {
//             res.render('folders', {
//                 files: files,
//                 folders: folders,
//             })
//         })
//         .catch(err => {throw err});
// });
//
// ﻿router.get('/f:id', async (req, res,next) => {
//         try {
//             let children = await folderCtrl.getAllChildren(req.params.id);
//             let parent = await folderCtrl.getById(req.params.id);
//             res.render('f', {
//                 children: children,
//                 curr: parent,
//             });
//         }catch (e){
//             console.log(e);
//             next(e);
//         }
//     });
//
// router.get('/addFolder',function(req, res, next) {
//     res.render('add', {folder: req.params.id, isFile: false});
// });
//
// router.post('/addFolder',async function (req, res, next) {
//
//     await folderCtrl.create(
//         req.body.name,
//         req.body.owner,
//         req.body.description,
//         req.params.id)
//         .﻿then(data => {folderCtrl.addChild(req.params.id, data._id)})
//         .catch(err => utilties.error(500,"Some error at server, when create:"+err,next));
//
//     res.redirect('/folders');
// })
// router.get('/f:id/addFolder',function(req, res, next) {
//     res.render('add', {folder: req.params.id, isFile: false});
// });
//
// router.post('/f:id/addFolder',async function (req, res, next) {
//
//     await folderCtrl.create(
//         req.body.name,
//         req.body.owner,
//         req.body.description,
//         req.params.id)
//         .﻿then(data => {folderCtrl.addChild(req.params.id, data._id)})
//         .catch(err => utilties.error(500,"Some error at server, when create:"+err,next));
//
//     res.redirect('/folders/f'+req.params.id);
// })
//
// router.get('/f:id/addFile',function(req, res, next) {
//     res.render('add', {folder: req.params.id, isFile: true});
// });
//
// router.post('/f:id/addFile',async function (req, res, next) {
//
//     await fileCtrl.create(
//         req.body.name,
//         req.files.img,
//         req.body.owner,
//         req.body.description,
//         req.params.id)
//         .﻿then(data => {fileCtrl.addChild(req.params.id, data._id)})
//         .catch(err => utilties.error(500,"Some error at server, when create:"+err,next));
//
//     res.redirect('/folders/f'+req.params.id);
// })
//

var express = require('express');
var router = express.Router();

const folderCtrl = require('../controllers/folderController');
const fileCtrl = require('../controllers/fileController');
const imgCtrl = require('../controllers/fileDataController');
// const userCtrl = require('../controllers/usersController');
const utilties = require('../utilities/utilities');

﻿router.get('/f:id', async (req, res,next) => {
    try {
        let children = await folderCtrl.getAllChildren(req.params.id);
        console.log("_____"+children.length);
        let parent = await folderCtrl.getById(req.params.id);
        res.render('f', {
            children: children,
            curr: parent,
        });
    }catch (e){
        console.log(e);
        next(e);
    }
});

router.get('/f:id/addFolder',function(req, res, next) {
    res.render('add', {folder: req.params.id, isFile: false});
});

router.post('/f:id/addFolder',async function (req, res, next) {

    await folderCtrl.create(
        req.body.name,
        req.body.owner,
        req.body.description,
        req.params.id)
        .﻿then(data => {folderCtrl.addChild(req.params.id, data._id, false)})
        .catch(err => utilties.error(500,"Some error at server, when create:"+err,next));

    res.redirect('/folders/f'+req.params.id);
})

router.get('/f:id/addFile',function(req, res, next) {
    res.render('add', {folder: req.params.id, isFile: true});
});

router.post('/f:id/addFile',async function (req, res, next) {

    await fileCtrl.create(
        req.body.name,
        req.files.img,
        req.body.owner,
        req.body.description,
        req.params.id)
        .﻿then(data => {folderCtrl.addChild(req.params.id, data._id, true)})
        .catch(err => utilties.error(500,"Some error at server, when create:"+err,next));

    res.redirect('/folders/f'+req.params.id);
})

router.get('/a:id', async (req, res,next) => {
    try {
        let file = await fileCtrl.getById(req.params.id)
        res.render('file', {
            file: file,
        });
    }catch (e){
        console.log(e);
        next(e);
    }
});

router.post('/f:id/removeFile',function(req, res, next) {
    folderCtrl.getById(req.params.id)
        .then(folder => {
            folderCtrl.removeAllFiles(folder)
                .then(()=>{
                    res.redirect('/folders/f'+req.params.id);
                })

        })
        .catch(err => utilties.error(500,"Some error at server, when remove",next));
});

router.post('/f:id/removeFolder',function(req, res, next) {
    folderCtrl.getById(req.params.id)
        .then(folder => {
            folderCtrl.removeAll(req.params.id)
                .then(()=>{
                    res.redirect('/folders/f'+req.params.id);
                })

        })
        .catch(err => utilties.error(500,"Some error at server, when remove",next));
});

module.exports = router;