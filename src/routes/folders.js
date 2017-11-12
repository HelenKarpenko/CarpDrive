var express = require('express');
const folderCtrl = require('../controllers/folderController');
const itemCtrl = require('../controllers/itemController');
const imgCtrl = require('../controllers/fileController');
const userCtrl = require('../controllers/usersController');
const utilties = require('../utilities/utilities');
var router = express.Router();

router.get('/f:id',function(req, res, next) {
    Promise.all([
        itemCtrl.getAll(),
        itemCtrl.getById(req.params.id)
    ])
        .then(([p1, p2]) => {
        res.render('f',
            {
                folders: p1,
                folder: p2,
            })
    })
        .catch(err => {
            utilties.error(500,"Some error at server, when search folder by id",next);
        })
});

router.get('/f:id/add',function(req, res, next) {
    res.render('add', {folder: req.params.id});
});

router.post('/f:id/add',async function (req, res, next) {
    console.log("+++++"+ req.params.id)
    await itemCtrl.create(
        req.body.name,
        req.files.img,
        false,
        req.body.owner,
        req.body.description,
        req.params.id)
        .﻿then(data => {itemCtrl.addChild(req.params.id, data._id)})
        .catch(err=>utilties.error(500,"Some error at server, when create:"+err,next));
    res.redirect('/folders');
})

router.get('/', function (req, res, next) {
    itemCtrl.getAll()
        .then(data => {
            let args = utilties.paginate(data, (req.query.page) ? req.query.page : 1);
            args.user = req.user;
            res.render('folders', args,)
        })
        .catch(err => {throw err});
});



module.exports = router;