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

router.route('/:id/tree')
    .get(passport.authenticate(['bearer-access', 'basic']), async (req, res, next) => {
        if(tools.check(req.params.id)){
            let folders = await folderCtrl.getSharedFolder(req.user);

            let result = {};
            if(folders){
                result = {
                    success: true,
                    folders: folders,
                }
            }
            res.json(result);
        }else{
            res.json({err: 'error'})
        }
    })
router.route('/:id')
    .get(passport.authenticate(['bearer-access', 'basic']), async (req, res, next) => {
        if(tools.check(req.params.id)){
            let children = await folderCtrl.getShareChildren(req.params.id,req.user);
            // let info = await folderCtrl.getInfo(req.params.id);

            let result = {};
            if(children){
                result = {
                    success: true,
                    folder:{
                        // info: info,
                        children: children,
                    }
                }
            }
            res.json(result);
        }else{
            res.json({err: 'error'})
        }
    })

module.exports = router;