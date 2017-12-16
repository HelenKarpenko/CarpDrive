// todo
// get publication by query
// remove publication
// create publication
// update publication
"use strict";
const express = require('express');
let router = express.Router();
const Utils = require('@utils');
const DBpublications = require('@DB/controller.publications')
const DBimage = require('@DB/controller.image')
const DBusers = require('@DB/controller.users')
const config = require('@config');
const auth = require('@auth')
let tools = {
    collect: {
        find: (req) => {
            return {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || config.LIMIT,
                query: tools.query.find(req.query)
            }
        },
        delete: (req) => {
            return {
                query: tools.query.delete(req.body)
            }
        },
        put: (req) => {
            return {
                query: tools.query.put(req.body)
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
        delete: (args, user) => {
            return args.query.id && ( user.isAdmin || user.publications.indexOf(args.query.id) >= 0);
        },
        put: (args, user) => {
            return tools.check.delete(args, user) && Object.keys(args.query.values).length > 0;
        },
        post: (args) => {
            return args.query && args.query.title && args.query.text;
        }
    },
    query: {
        find: (req) => {
            let query = {}
            //title
            if (req.title) {
                query.title = new RegExp(`^${req.title.trim()}`, "i");
            }
            //author
            if (req.author && Utils.isValidID(req.author)) {
                query.author_id = Utils.str2id(req.author);
            }
            //tag
            if (req.tags) {
                let tags = {$in: []};
                let parsed = Utils.parseJSON(req.tags);
                if (Array.isArray(parsed)) {
                    parsed.forEach((value) => {
                        tags.$in.push(String(value));
                    })
                } else if (parsed) {
                    tags.$in.push(parsed);
                }
                if (parsed) {
                    query.tags = tags;
                }
            }
            //id
            if (req.id) {
                if (Utils.isValidID(req.id)) {
                    query._id = Utils.str2id(req.id);
                } else {
                    query._id = Utils.emptyId();
                }
            }
            return query;
        },
        delete: (req) => {
            let query = {};
            if (req.id && Utils.isValidID(req.id)) {
                query.id = Utils.str2id(req.id);
            }
            return query;
        },
        put: (req) => {

            let query = {values: {}};
            // get target
            if (req.target && Utils.isValidID(req.target)) {
                query.id = Utils.str2id(req.target);
            }
            // get new values
            if (req.title) {
                query.values.title = req.title;
            }
            if (req.description) {
                query.values.description = req.description;
            }
            if (req.text) {
                query.values.text = req.text;
            }
            if (req.difficult && Number(req.difficult)) {
                query.values.difficult = req.difficult;
            }
            if (req.add_tags) {
                let parsed = Utils.parseJSON(req.add_tags);
                if (Array.isArray(parsed)) {
                    query.values.add_tags = [];
                    parsed.forEach((value) => {
                        query.values.add_tags.push(String(value));
                    })
                } else if (parsed) {
                    query.values.add_tags = [String(parsed)];
                }
            }
            if (req.remove_tags) {
                let parsed = Utils.parseJSON(req.remove_tags);
                if (Array.isArray(parsed)) {
                    query.values.remove_tags = [];
                    parsed.forEach((value) => {
                        query.values.remove_tags.push(String(value));
                    })
                } else if (parsed) {
                    query.values.remove_tags = [String(parsed)];
                }
            }
            if (req.image_id && Utils.isValidID(req.image_id)) {
                query.image_id = Utils.str2id(req.image_id);
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
                items: tools.doc2items(args.docs)
            }
        },
        delete: (args) => {
            return {
                success: true,
                query: args.query,
                publication: tools.minimize(args.publication)
            }
        },
        put: (args) => {
            return tools.result.delete(args)
        },
        post: (args) => {
            return {
                success: true,
                publication: tools.minimize(args.publication)
            }
        }
    },
    doc2items (docs) {
        if (docs) {
            let items = [];
            docs.forEach((doc) => {
                items.push(tools.minimize(doc));
            });
            return items;
        } else {
            return []
        }
    },
    minimize: (doc) => {
        return {
            title: doc.title,
            author_id: doc.author_id,
            image_id: doc.image_id,
            text: doc.text,
            description: doc.description,
            id: doc._id,
            createdAt: doc.createdAt,
            tags: doc.tags,
            difficult: doc.difficult
        }
    }
};

router.route('/')
    .get(async (req, res, next) => {
        const args = tools.collect.find(req);
        if (!tools.check.find(args)) {
            return Utils.errorAPI(res, 400, "Invalid arguments");
        }
        try {
            const result = await DBpublications.find(args.query, args.page, args.limit);
            return res.json(tools.result.find(result));
        } catch (e) {
            console.log(e);
            return Utils.errorAPI(res, 500, "Server error");
        }
    })
    .delete(auth.jwt.check.login, async (req, res, next) => {
        const args = tools.collect.delete(req);
        if (!tools.check.delete(args, req.user)) {
            if (!args.query.id) {
                return Utils.errorAPI(res, 400, "Invalid arguments");
            } else {
                return Utils.errorAPI(res, 403, "Forbidden");
            }
        }
        try {
            args.publication = await DBpublications.remove(args.query.id);
            if (args.publication) {
                console.log(args.publication);
                if (args.publication.image_id) {
                    try {
                        if (await DBimage.isFileExist(args.publication.image_id)) {
                            await DBimage.remove(args.publication.image_id);
                        }
                    } catch (e) {
                    }
                }
                const owner = await DBusers.getById(args.publication.author_id);
                if (owner) {
                    owner.removePublication(args.publication.id);
                }
                return res.json(tools.result.delete(args));
            } else {
                return Utils.errorAPI(res, 404, "No such publication");
            }
        } catch (e) {
            console.log(e);
            return Utils.errorAPI(res, 500, "Server error");
        }
    })
    .put(auth.jwt.check.login, async (req, res, next) => {
        const args = tools.collect.put(req);
        if (!tools.check.put(args, req.user)) {
            return Utils.errorAPI(res, 400, "Invalid arguments");
        }
        try {
            args.publication = await DBpublications.getById(args.query.id);
            if (args.publication) {
                if (!await args.publication.update(args.query.values)) {
                    return Utils.errorAPI(res, 400, "Bad arguments");
                } else {
                    return res.json(tools.result.delete(args));
                }
            } else {
                return Utils.errorAPI(res, 404, "No such publication");
            }
        } catch (e) {
            console.log(e);
            return Utils.errorAPI(res, 500, "Server error");
        }
    })
    .post(auth.jwt.check.login, async (req, res, next) => {
        const args = tools.collect.post(req);
        console.log(JSON.stringify(args));
        if (!tools.check.post(args, req.user)) {
            return Utils.errorAPI(res, 400, "Invalid arguments");
        }
        try {
            args.publication = await DBpublications.create(
                args.query.title,
                req.user._id,
                args.query.image_id,
                args.query.tags,
                args.query.difficult,
                args.query.description,
                args.query.text);
            if (args.publication) {
                await req.user.addPublication(args.publication._id);
                return res.json(tools.result.put(args));
            } else {
                return Utils.errorAPI(res, 400, "Bad arguments");
            }
        } catch (e) {
            console.log(e);
            return Utils.errorAPI(res, 500, "Server error");
        }
    })


module.exports = router;