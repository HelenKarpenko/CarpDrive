const express = require('express');
let router = express.Router();

const folderCtrl = require('../../../storage/controllers/folderController');
const fileCtrl = require('../../../storage/controllers/fileController');
const fileDataCtrl = require('../../../storage/controllers/fileDataController');
const userCtrl = require('../../../storage/controllers/usersController');
const util = require('../../../utils/utils');
const passport = require('passport');

const ObjectId = require('mongoose').Types.ObjectId;

let tools = {
    check: (id) => {
        return id || ObjectId.isValid(id);
    },
    result: {

    }
};

let MOTHER_FOLDER = "5a30671f7dadbb136173ad05"

router.get('/find',async(req, res,next) => {
    console.log("=============")
    if(req.query.limit < 0 ||
        req.query.page < 0 ||
        ('limit' in req.query && !Number(req.query.limit))||
        ('page' in req.query && !Number(req.query.page))) {
        return util.sendError(400, 'Bad request', res);
    }
    const query = parseQuery(req.query);
    query.owner = req.user;
    console.log("=============")
    let folders = await folderCtrl.find(query, req.query.page, req.query.limit)
    console.log("=============")
    res.json({
        success: true,
        children: folders.docs,
    })
});

router.route('/:id')
    .get(async (req, res, next) => {
        if(tools.check(req.params.id)){
            let user = req.user;
            console.log(user);
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
    .post( async (req, res, next) => {
        if(tools.check(req.params.id)){
            let myDrive = await folderCtrl.getMyDrive(req.params.id);
            let item;

            console.log('+++++++++++++++');
            console.log(req.body.isFolder)
            if(req.body.isFolder != 'false'){
                console.log('000000000')
                item = await folderCtrl.create(myDrive, req.body.name, req.user._id);
            }else{
                console.log('1111111111')
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
    .delete( async (req, res, next) => {
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
    .put( async (req, res, next) => {
        if(tools.check(req.params.id)){
            await folderCtrl.rename(req.params.id, req.body.name);
            let folder = await folderCtrl.getMyDrive(req.params.id);

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

router.get('/:id/copy',async(req, res,next) => {
    if(tools.check(req.params.id)){
        let firstFolder = await folderCtrl.getMyDrive(req.params.id);
        console.log(firstFolder);
        let folder
        if(firstFolder.isFolder){
            console.log('Folder');
            folder = await folderCtrl.copyFolder(req.params.id);
        }else{
            console.log('Enter');
            folder = await fileCtrl.copy(req.params.id)
        }
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

router.post('/:id/share',async(req, res,next) => {
    if(tools.check(req.params.id)){
        if(!req.body.username) return utilities.apierror(400,"Bad request",res)

        let user = await userCtrl.getByUsername(req.body.username);
        // console.log(user);
        let isShare = await folderCtrl.shareFolder(req.params.id, user._id);

        let result = {
            success: isShare,
        };
        res.json(result);
    }else{
        res.json({err: 'error'})
    }
});

router.get('/image/:id',async(req, res,next) => {

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

router.get('/:id/path/', async(req, res,next) => {
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

router.get('/:id/file',async(req, res,next) => {
    if(tools.check(req.params.id)){
        let file = await fileCtrl.getById(req.params.id);
        let fileData = await fileDataCtrl.getById(file.data)
        res.type(fileData.filename.split('.').pop());
        fileData.stream.pipe(res)
    }else{
        res.json({err: 'error'})
    }
});

router.get('/:id/fileInfo',async(req, res,next) => {
    if(tools.check(req.params.id)){
        let file = await fileCtrl.getById(req.params.id);
        let fileData = await fileDataCtrl.getById(file.data)
        res.json({
            filename: fileData.filename,
            type: fileData.contentType,
        });
    }else{
        res.json({err: 'error'})
    }
});

router.get('/:id/fileType',async(req, res,next) => {
    if(tools.check(req.params.id)){
        let data = await fileCtrl.getData(req.params.id)
        res.json({
            success: true,
            type: data.contentType,
        })
    }else{
        res.json({err: 'error'})
    }
});


function parseQuery(req) {
    let query = {};
    if(req.name){
        query.name = new RegExp('^'+req.name.trim(), "i");
    }
    return query;
}

module.exports = router;