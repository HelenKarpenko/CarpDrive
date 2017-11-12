var express = require('express');
let fs = require('fs-promise');
//﻿const folder = require('../modul/folder_storage');
const folderCtrl = require('../controllers/folderController');
const imgCtrl = require('../controllers/imgController');
const userCtrl = require('../controllers/usersController');
const utilties = require('../utilities/utilities');
var router = express.Router();

router.get('/f:id',utilties.checkAuth, function(req, res, next) {
    Promise.all([
        folderCtrl.getAll(),
        folderCtrl.getById(req.params.id)
    ])
        .then(([p1, p2]) => {
        res.render('f',
            {
                folders: p1,
                folder: p2,
                user: req.user
            })
    })
        .catch(err => {
            utilties.error(500,"Some error at server, when search folder by id",next);
        })
});

router.post('/remove/:id',utilties.checkAuth, utilties.checkAdmin, function(req, res, next) {
    folderCtrl.getById(req.params.id).then((folder)=>{
        folderCtrl.remove(req.params.id).then(()=>{
            "use strict";
            imgCtrl.remove(folder.img).then(()=>res.redirect('/folders'));
        });
    }).catch(err => utilties.error(500,"Some error at server, when remove",next));

});

router.get('/add',utilties.checkAuth, utilties.checkAdmin, function(req, res, next) {
    res.render('add', {});
});

router.post('/add',utilties.checkAuth, utilties.checkAdmin,function (req, res, next) {
    folderCtrl.create(
        req.files.img,
        req.body.name,
        req.body.size,
        req.body.type,
        req.body.location,
        req.user.name,
        req.body.description)
        .then(data => {
            userCtrl.addFolder(req.user._id, data._id)
        })
        .catch(err=>utilties.error(500,"Some error at server, when create",next));
    res.redirect('/folders');
})

router.get('/search/',utilties.checkAuth, function (req, res, next) {
    folderCtrl.getByName(req.query.name)
        .then(data => {
            let args = utilties.paginate(data, (req.query.page)?req.query.page:1);
            args.user = req.user;
            res.render('folders', args)})
        .catch(err => {throw err});
});

router.get('/', utilties.checkAuth, function (req, res, next) {
    folderCtrl.getAll()
        .then(data => {
            let args = utilties.paginate(data, (req.query.page) ? req.query.page : 1);
            args.user = req.user;
            res.render('folders', args,)
        })
        .catch(err => {throw err});
});

module.exports = router;