const express = require('express');
let router = express.Router();

const folderCtrl = require('../../../storage/controllers/folderController');
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
            let folder = await folderCtrl.create(myDrive, req.body.name)

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
    .delete(async (req, res, next) => {
        if(req.params.id && ObjectId.isValid(req.params.id)){
            let result = folderCtrl.remove(req.params.id);
            res.json(result);
        }else{
            res.json({err: 'error'})
        }
    })
module.exports = router;