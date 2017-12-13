const express = require('express');
let router = express.Router();

const folderCtrl = require('../../../storage/controllers/folderController');
const userCtrl = require('../../../storage/controllers/usersController');
const Util = require('../../../utils/utils');

const ObjectId = require('mongoose').Types.ObjectId;

// const config = require('@config');
// const auth = require('@auth')
let tools = {
    collect:{
        get: (req) => {
            return req.params.id
        }
    },
    check: {
        find: (args) => {
            if (!args.page || !Number(args.page) || Number(args.page) <= 0) {
                return false;
            }
            if (!args.limit || !Number(args.limit) || Number(args.limit) <= 0) {
                return false;
            }
            if (!args.query) return false;
            return true;
        },
    },

    collect: {
        find: (req) => {
            return {
                // page: Number(req.query.page) || 1,
                // limit: Number(req.query.limit) || config.LIMIT,
                query: tools.query.find(req.query)
            }
        },
        post: (req) => {
            return {
                query: tools.query.post(req.body)
            }
        }
    },
    check: {
        find: (args) => {
            if (!args.page || !Number(args.page) || Number(args.page) <= 0) {
                return false;
            }
            if (!args.limit || !Number(args.limit) || Number(args.limit) <= 0) {
                return false;
            }
            if (!args.query) return false;
            return true;
        },
        post: (args) => {
            return args.query && args.query.title && args.query.text;
        }
    },
    query: {
        find: (req) => {
            let query = {}
            //title
            if (req.name) {
                query.name = new RegExp(`^${req.name.trim()}`, "i");
            }
            return query;
        },
        post: (req) => {
            let query = {};
            if (req.title) {
                query.title = req.title;
            }
            if (req.description) {
                query.description = req.description;
            }
            if (req.text) {
                query.text = req.text;
            }
            if (req.difficult && Number(req.difficult)) {
                query.difficult = req.difficult;
            }
            if (req.tags) {
                let parsed = Utils.parseJSON(req.tags);
                if (Array.isArray(parsed)) {
                    query.tags = [];
                    parsed.forEach((value) => {
                        query.tags.push(String(value));
                    })
                } else if (parsed) {
                    query.tags = [String(parsed)];
                }
            }
            if (req.image_id && Utils.isValidID(req.image_id)) {
                query.image_id = Utils.str2id(req.image_id);
            }
            return query;
        }
    },
    result: {
        find: (args) => {
            return {
                success: true,
                query: args.query,
                page: args.page,
                total: args.total,
                limit: args.limit,
                pages: args.pages,
                // items: tools.doc2items(args.docs)
            }
        },
        post: (args) => {
            return {
                success: true,
                publication: tools.minimize(args.publication)
            }
        }
        // },
        // doc2items (docs) {
        //     if (docs) {
        //         let items = [];
        //         docs.forEach((doc) => {
        //             items.push(tools.minimize(doc));
        //         });
        //         return items;
        //     } else {
        //         return []
        //     }
        // },
        // minimize: (doc) => {
        //     return {
        //         title: doc.title,
        //         author_id: doc.author_id,
        //         image_id: doc.image_id,
        //         text: doc.text,
        //         description: doc.description,
        //         id: doc._id,
        //         createdAt: doc.createdAt,
        //         tags: doc.tags,
        //         difficult: doc.difficult
        //     }
    }
};

let MOTHER_FOLDER = "5a30671f7dadbb136173ad05"

router.route('/')
    .get(async (req, res, next) => {
        let id = "5a3067287dadbb136173ad07";
        let children = await folderCtrl.getAllChildren(MOTHER_FOLDER);
        let info = await folderCtrl.getInfo(MOTHER_FOLDER);

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
    })

router.route('/:id')
    .get(async (req, res, next) => {
        if(req.params.id && ObjectId.isValid(req.params.id)){
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
    .post(async (req, res, next) => {
        if(req.params.id && ObjectId.isValid(req.params.id)){
            let myDrive = await folderCtrl.getMyDrive(id);
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