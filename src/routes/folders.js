var express = require('express');
var router = express.Router();
var path = require('path');

const folderCtrl = require('../controllers/folderController');
const fileCtrl = require('../controllers/fileController');
const imgCtrl = require('../controllers/fileDataController');
const userCtrl = require('../controllers/usersController');
const utilities = require('../utilities/utilities');

﻿router.get('/',utilities.checkAuth, async (req, res,next) => {
    res.redirect('/folders/f'+req.user.folder);
});

﻿router.get('/f:id',utilities.checkAuth, async (req, res,next) => {
    try {
        let dirTree = await folderCtrl.getAllChildrenJSON(req.user.folder);
        let parent = await folderCtrl.getById(req.params.id);
        let items = await folderCtrl.getAllItems(req.params.id)
        let args = utilities.paginate(items,(req.query.page) ? req.query.page : 1);
        args.dirTree = dirTree;
        args.curr = parent;
        args.user = req.user;
        args.isSearch = false;
        args.isAdmin = checkAdmin(req);
        console.log("++++"+ parent._id + " = " + req.user.folder);
        res.render('f', args);
    }catch (e){
        console.log(e);
        next(e);
    }
});

router.get('/f:id/search/',utilities.checkAuth, async (req, res, next) => {
    try {
        let dirTree = await folderCtrl.getAllChildrenJSON(req.user.folder);
        let parent = {
            name: "SEARCH"
        }
        let folders = await folderCtrl.getByName(req.query.name, req.user._id);
        let files = await fileCtrl.getByName(req.query.name, req.user._id);
        let items = [];
        for(let f of folders){
            items.push(f)
        }
        for(let f of files){
            items.push(f)
        }

        let args = utilities.paginate(items,(req.query.page) ? req.query.page : 1);
        args.dirTree = dirTree;
        args.curr = parent;
        args.user = req.user;
        args.folders = folders;
        args.files = files;
        args.isSearch = true;

        res.render('search', args );
    }catch (e){
        console.log(e);
        next(e);
    }
});

router.get('/f:id/addFolder', utilities.checkAuth,function(req, res, next) {
    res.render('add', {
        folder: req.params.id,
        isFile: false,
        title: 'Create new folder',
    });
});

router.post('/f:id/addFolder', utilities.checkAuth,async function (req, res, next) {

    await folderCtrl.create(
        req.body.name,
        req.user._id,
        req.body.description,
        req.params.id)
        .﻿then(data => {folderCtrl.addChild(req.params.id, data._id, false)})
        .catch(err => utilities.error(500,"Some error at server, when create:"+err,next));

    res.redirect('/folders/f'+req.params.id);
})

router.get('/f:id/addFile',utilities.checkAuth,function(req, res, next) {
    res.render('add', {
        folder: req.params.id,
        isFile: true,
    });
});

router.post('/f:id/addFile',utilities.checkAuth,async function (req, res, next) {
    await fileCtrl.create(
        req.body.name,
        req.files.img,
        req.body.owner,
        req.body.description,
        req.params.id)
        .﻿then(data => {folderCtrl.addChild(req.params.id, data._id, true)})
        .catch(err => utilities.error(500,"Some error at server, when create:"+err,next));

    res.redirect('/folders/f'+req.params.id);
})

// router.post('/f:id/removeFile',function(req, res, next) {
//     folderCtrl.getById(req.params.id)
//         .then(folder => {
//             folderCtrl.removeAllFiles(folder)
//                 .then(()=>{
//                     res.redirect('/folders/f'+req.params.id);
//                 })
//
//         })
//         .catch(err => utilities.error(500,"Some error at server, when remove",next));
// });

router.post('/f:id/removeAll',utilities.checkAuth,function(req, res, next) {
    folderCtrl.getById(req.params.id)
        .then(folder => {
            folderCtrl.removeAll(req.params.id)
                .then(()=>{
                    res.redirect('/folders/f'+req.params.id);
                })

        })
        .catch(err => utilities.error(500,"Some error at server, when remove",next));
});

router.post('/f:id/removeFolder',utilities.checkAuth,utilities.checkMainFolder,function(req, res, next) {
    folderCtrl.getById(req.params.id)
        .then(folder => {
            folderCtrl.removeAll(req.params.id)
                .then(()=>{
                    folderCtrl.remove(req.params.id)
                        .then(()=>res.redirect('/folders/f'+folder.parent));
                })

        })
        .catch(err => utilities.error(500,"Some error at server, when remove",next));
});

router.get('/a:id', utilities.checkAuth,async (req, res,next) => {
    try {
        let dirTree = await folderCtrl.getAllChildrenJSON(req.user.folder);
        let file = await fileCtrl.getById(req.params.id);
        res.render('file', {
            dirTree: dirTree,
            curr: file,
            user: req.user
        });
    }catch (e){
        console.log(e);
        next(e);
    }
});

router.get('/a:id/download',utilities.checkAuth,async(req, res, next) => {
    try{
        let data = await fileCtrl.getData(req.params.id)
        res.type(data.filename.split('.').pop());
        data.stream.pipe(res);
    }catch (e){
        res.status(404);
        next();
    }
});

router.post('/a:id/removeFile',utilities.checkAuth,async(req, res, next) => {
    try{
        let file = await fileCtrl.getById(req.params.id);
        let folder = await folderCtrl.getById(file.parent);
        fileCtrl.remove(req.params.id, folder)
            .then(()=>{
                res.redirect('/folders/f'+folder._id);
            })
    }catch (e){
        utilties.error(500,"Some error at server, when remove",next);
    }
});

router.get('/f:id/removeUser',utilities.checkAuth,utilities.checkAdmin, async(req, res, next) => {
    try{
        console.log("++++++" + req.params.id);
        let folder = await folderCtrl.getById(req.params.id);
        let user = await userCtrl.getById(folder.owner);
        res.render('removeUser', {
             warning: "When you delete this folder "+ folder.name +" ("+ folder._id +"), delete its owner "+ user.name+" ("+user._id +") !",
            user: user,
            folder: folder
        });
    }catch(e){
        console.log(e);
    }
});


const adminId = '5a0c9091180b171fde9b15d8'
function checkAdmin(req) {
    console.log("CHECKADMIN  " + req.user._id + " "+ adminId);
    if((String)(req.user._id) === (String)(adminId)) return true;
    return false;
}
module.exports = router;