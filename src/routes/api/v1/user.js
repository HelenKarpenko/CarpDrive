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

// router.route('/:id')
//     .get(async (req, res, next) => {
//         if(tools.check(req.params.id)){
//             let user = req.user;
//             console.log(user);
//             let children = await folderCtrl.getChildren(req.params.id);
//             let info = await folderCtrl.getInfo(req.params.id);
//
//             let result = {};
//             if(info && children){
//                 result = {
//                     success: true,
//                     folder:{
//                         info: info,
//                         children: children,
//                     }
//                 }
//             }
//             res.json(result);
//         }else{
//             res.json({err: 'error'})
//         }
//     })
//     .post( async (req, res, next) => {
//         if(tools.check(req.params.id)){
//             let myDrive = await folderCtrl.getMyDrive(req.params.id);
//             let item;
//             if(req.body.isFolder){
//                 item = await folderCtrl.create(myDrive, req.body.name, req.user._id);
//             }else{
//                 item = await fileCtrl.create(myDrive,req.files.img.name,req.user._id,req.files.img);
//             }
//
//             let result = {};
//             if(item){
//                 result = {
//                     success: true,
//                     folder: item,
//                 }
//             }
//             res.json(result);
//         }else{
//             res.json({err: 'error'})
//         }
//     })
//     .delete( async (req, res, next) => {
//         if(tools.check(req.params.id)){
//             let folder = folderCtrl.remove(req.params.id);
//
//             let result = {};
//             if(folder){
//                 result = {
//                     success: true,
//                     folder: folder,
//                 }
//             }
//             res.json(result);
//         }else{
//             res.json({err: 'error'})
//         }
//     })
//     .put( async (req, res, next) => {
//         if(tools.check(req.params.id)){
//             await folderCtrl.rename(req.params.id, req.body.name);
//             let folder = await folderCtrl.getMyDrive(req.params.id);
//
//             let result = {};
//             if(folder){
//                 result = {
//                     success: true,
//                     folder: folder,
//                 }
//             }
//             res.json(result);
//         }else{
//             res.json({err: 'error'})
//         }
//     })
router.route('/:id/setAvatar')
    .post( async (req, res, next) => {
        if(tools.check(req.params.id)){
            let user = await userCtrl.setAvatar(req.params.id, req.files.img)

            let result = {};
            if(user){
                result = {
                    success: true,
                    user: user,
                }
            }
            res.json(result);
        }else{
            res.json({err: 'error'})
        }
    })

router.get('/:id/avatar',async(req, res,next) => {
    if(tools.check(req.params.id)){
        let user = await userCtrl.getById(req.params.id);
        let fileData = await fileDataCtrl.getById(user.avatar)
        res.type(fileData.filename.split('.').pop());
        fileData.stream.pipe(res)
    }else{
        res.json({err: 'error'})
    }
});

module.exports = router;