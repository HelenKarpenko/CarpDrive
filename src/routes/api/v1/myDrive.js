const express = require('express');
let router = express.Router();

const folderCtrl = require('../../../storage/controllers/folderController');
const fileCtrl = require('../../../storage/controllers/fileController');
const fileDataCtrl = require('../../../storage/controllers/fileDataController');
const userCtrl = require('../../../storage/controllers/usersController');
const util = require('../../../utils/utils');
const passport = require('passport');

const ObjectId = require('mongoose').Types.ObjectId;

// const config = require('@config');
// const auth = require('@auth')
let tools = {
    check: (id) => {
        return id || ObjectId.isValid(id);
    },
    result: {

    }
};

let MOTHER_FOLDER = "5a30671f7dadbb136173ad05"

router.route('/:id')
    .get(passport.authenticate(['bearer-access', 'basic']), async (req, res, next) => {
        if(tools.check(req.params.id)){
            let children = await folderCtrl.getChildren(req.params.id);
            let info = await folderCtrl.getInfo(req.params.id);

            let result = {};
            if(info && children){
                result = {
                    success: true,
                    folder:{
                        info: info,
                        children: children,
                    }
                }
            }
            res.json(result);
        }else{
            res.json({err: 'error'})
        }
    })
    .post(passport.authenticate(['bearer-access', 'basic']), async (req, res, next) => {
        if(tools.check(req.params.id)){
            let myDrive = await folderCtrl.getMyDrive(req.params.id);
            let item;
            if(req.body.isFolder){
                item = await folderCtrl.create(myDrive, req.body.name, req.user._id);
            }else{
                console.log("<<<<");
                console.log(req.files.img.name);
                console.log("<<<<");
                console.log(req.files.img.data);
                item = await fileCtrl.create(myDrive,req.files.img.name,req.user._id,req.files.img);
            }

            let result = {};
            if(item){
                result = {
                    success: true,
                    folder: item,
                }
            }
            res.json(result);
        }else{
            res.json({err: 'error'})
        }
    })
    .delete(passport.authenticate(['bearer-access', 'basic']), async (req, res, next) => {
        if(tools.check(req.params.id)){
            let folder = folderCtrl.remove(req.params.id);

            let result = {};
            if(folder){
                result = {
                    success: true,
                    folder: folder,
                }
            }
            res.json(result);
        }else{
            res.json({err: 'error'})
        }
    })
    .put(passport.authenticate(['bearer-access', 'basic']), async (req, res, next) => {
        if(tools.check(req.params.id)){
            await folderCtrl.rename(req.params.id, req.body.name);
            let folder = await folderCtrl.getMyDrive(req.params.id);
            console.log(folder);

            let result = {};
            if(folder){
                result = {
                    success: true,
                    folder: folder,
                }
            }
            res.json(result);
        }else{
            res.json({err: 'error'})
        }
    })
router.get('/:id/copy', passport.authenticate(['bearer-access', 'basic']),async(req, res,next) => {
    if(tools.check(req.params.id)){
        let folder = await folderCtrl.copyFolder(req.params.id);
        let result = {};
        if(folder){
            result = {
                success: true,
                folder: folder,
            }
        }
        res.json(result);
    }else{
        res.json({err: 'error'})
    }
});

router.get('/image/:id', passport.authenticate(['bearer-access', 'basic']),async(req, res,next) => {

    if(req.params.id && ObjectId.isValid(req.params.id)) {
        try{
            let image = await fileDataCtrl.getById(req.params.id);
            res.type(image.filename.split('.').pop());
            image.stream.pipe(res);
        }catch (e){
            res.json(e);
        }
    }else{
        return utilities.apierror(400,'Bad request',res);
    }
});

router.get('/:id/path/',passport.authenticate(['bearer-access', 'basic']), async(req, res,next) => {
    if(req.params.id && ObjectId.isValid(req.params.id)) {
        try{
            let path = await folderCtrl.getPath(req.params.id);

            let result = {};
            if(path){
                result = {
                    success: true,
                    path: path,
                }
            }
            res.json(result);
        }catch (e){
            res.json(e);
        }
    }else{
        return utilities.apierror(400,'Bad request',res);
    }
});
module.exports = router;