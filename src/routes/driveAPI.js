var express = require('express');
var router = express.Router();

const folderCtrl = require('../storage/controllers/folderController');
const userCtrl = require('../storage/controllers/usersController');
const utilities = require('../utils/utils');

const ObjectId = require('mongoose').Types.ObjectId;


router.get('/folders/:folder_id', (req, res, next) => {
    let id = req.params.folder_id;
    if(id && ObjectId.isValid(id) &&
        (req.query.limit < 0 ||
        req.query.page < 0 ||
        ('limit' in req.query && !Number(req.query.limit)) ||
        ('page' in req.query && !Number(req.query.page)))){
        // utils.apierror(400,'Bad request',res);
    }else {
        // const query = parseQuery(req.query);
        // query.parent = id;
        let query = {parent: id};
        folderCtrl.find(query, req.query.page, req.query.limit)
            .then(items => {
                return res.json(items);
            });
    }
});

function parseQuery(req) {
    let query = {};
    if(req.name){
        query.name = new RegExp('^'+req.name.trim(), "i");
    }
    return query;
}

// router.get('/', async(req, res) => {
//     let text = await fs.readFile(path.join(__dirname, 'v1.md'), 'utf8');
//     let args = {
//         text: markdown(text),
//         user: req.user
//     };
//     res.render('v1', args);
//
//     res.status(200).end();
// });
//
// // FOLDER
//
// router.get('/folders', checkAuth, (req, res,next) => {
//     if(req.query.limit < 0 ||
//         req.query.page < 0 ||
//         ('limit' in req.query && !Number(req.query.limit))||
//         ('page' in req.query && !Number(req.query.page))){
//         utils.apierror(400,'Bad request',res);
//     }else {
//         const query = parseQuery(req.query);
//         console.log(query);
//         folderCtrl.find(query, req.query.page, req.query.limit)
//             .then(items => {
//                 return res.json(filterGetFolderInfo(items, query));
//             });
//     }
// });
//
// router.get('/folders/:id', checkAuth, (req, res,next) => {
//     if(req.params.id && ObjectId.isValid(req.params.id)) {
//         folderCtrl.getById(req.params.id)
//             .then(item => res.json(filterFolderInfo(item)))
//             .catch(err => res.json(err));
//     }else{
//         utils.apierror(400,'Bad request',res);
//     }
// });
//
// router.post('/folders', checkAuth, checkAdmin, async(req, res) => {
//     if(!req.body.name || !req.body.size) return utils.apierror(400,"Bad request",res)
//     let img = null;
//     if(req.files && req.files.img) {
//         img = req.files.img;
//     }
//     folderCtrl.create(
//         img,
//         req.body.name,
//         req.body.size,
//         req.body.type,
//         req.body.location,
//         req.user._id,
//         req.body.description)
//         .then(newItem => {
//             let result = {};
//             result.success = true;
//             result.folder = filterFolderInfo(newItem)
//             res.json(result);
//         })
//         .catch(err => utils.apierror(500,"Some error at server, when create "+ err, res));
// });
//
// router.put('/folders/:id', checkAuth, checkAdmin, async (req, res) => {
//     if(!req.body.fieldName || !req.body.newVal){
//         return utils.apierror(400,'No parameters found',res);
//     }
//
//     try{
//         let update = await folderCtrl.update(req.params.id, req.body.fieldName, req.body.newVal);
//         if(update === null) utils.apierror(400,"Bad request",res);
//         let folder = await folderCtrl.getById(req.params.id);
//         let result = {};
//         result.success = true;
//         result.folder = filterFolderInfo(folder)
//         res.json(result);
//     }catch(error){
//         utils.apierror(500,"Some error at server, when update",res);
//     }
// });
//
// router.delete('/folders/:id', checkAuth, checkAdmin, (req, res) => {
//     folderCtrl.remove(req.params.id)
//         .then(item => {
//             let result = {};
//             result.success = true;
//             result.folder = filterFolderInfo(item)
//             res.json(result);
//         })
//         .catch(err => {
//                 console.log(">>>>" +err);
//                 res.status(404).json({error: err})
//             }
//         );
// })
//
// // /FOLDER
//
// // USERS
//
// router.get('/users', checkAuth, checkAdmin, (req, res, next) => {
//     if(req.query.limit < 0 ||
//         req.query.page < 0||
//         ('limit' in req.query && !Number(req.query.limit))||
//         ('page' in req.query && !Number(req.query.page))){
//         utils.apierror(400,'Bad request',res);
//     }else {
//         const query = parseQuery(req.query);
//         userCtrl.find(query, req.query.page, req.query.limit)
//             .then(items => {
//                 res.json(filterGetUserInfo(items));
//             });
//     }
// });
//
// router.get('/users/:id', checkAuth, checkAdmin, (req, res, next) => {
//     if(req.params.id && ObjectId.isValid(req.params.id)) {
//         userCtrl.getById(req.params.id)
//             .then(item => res.json(filterUserInfo(item)))
//             .catch(err => res.json(err));
//     }else{
//         utils.apierror(400,'Bad request',res);
//     }
// });
//
// router.put('/users/:id', checkAuth, checkAdmin, async (req, res) => {
//     if(!req.body.fieldName || !req.body.newVal){
//         return utils.apierror(400,'No parameters found',res);
//     }
//     try{
//         let update = await userCtrl.update(req.params.id, req.body.fieldName, req.body.newVal);
//         if(update === null) utils.apierror(400,"Bad request",res);
//         let user = await userCtrl.getById(req.params.id);
//         let result = {};
//         result.success = true;
//         result.user = filterUserInfo(user)
//         res.json(result);
//     }catch(error){
//         utils.error(500,"Some error at server, when update",next);
//     }
// });
//
// router.delete('/users/:id', (req, res) => {
//     userCtrl.remove(req.params.id)
//         .then(item => {
//             let result = {};
//             result.success = true;
//             result.user = filterUserInfo(item)
//             res.json(result);
//         })
//         .catch(err => {
//                 console.log(">>>>" +err);
//                 res.status(404).json({error: err})
//             }
//         );
// })
//
// // /USERS
//
// router.post('/login', async (req, res) => {
//     if(!req.body.username || !req.body.password) return utils.apierror(400,"Bad request",res)
//     let answer = await userCtrl.checkPassword(req.body.username, req.body.password);
//     let result = answer;
//     if(answer.success){
//         console.log("login " + req.body.username);
//         let user = await userCtrl.getByUsername(req.body.username);
//         result.user = filterUserInfo(user);
//     }
//     res.json(result);
// });
//
// router.post('/register', async (req, res) => {
//     if(!req.body.name || !req.body.username || !req.body.password) return utils.apierror(400,"Bad request",res)
//
//     let passwordHash = utils.sha512(req.body.password, serverSalt).passwordHash;
//     let user = await userCtrl.getByUsername(req.body.username);
//     if(!user) {
//         userCtrl.create(
//             req.body.name,
//             req.body.username,
//             passwordHash,
//             false)
//             .then(newItem => {
//                 let result = {};
//                 result.success = true;
//                 result.user = filterUserInfo(newItem)
//                 res.json(result);
//             })
//             .catch(err => utils.apierror(500, "Some error at server, when create " + err, res));
//     }else{
//         utils.apierror(400, "User with same username already exists", res)
//     }
// });
//
// function parseQuery(req) {
//     let query = {};
//     if(req.name){
//         query.name = new RegExp('^'+req.name.trim(), "i");
//     }
//     return query;
// }
//
//
// const pagesRange = 4;
// function filterGetFolderInfo(object, query) {
//     let result = object;
//     result.docs = filterFoldersInfo(object.docs);
//     result.range = pagesRange;
//     return result;
// }
// function filterFoldersInfo(items) {
//     let result = [];
//     for(let item of items){
//         result.push(filterFolderInfo(item));
//     }
//     return result;
// }
// function filterFolderInfo(item) {
//     let result = {};
//     result.id = item._id;
//     result.img_id = item.img;
//     result.name = item.name;
//     result.size = item.size;
//     result.type = item.type;
//     result.location = item.location;
//     result.owner = item.owner;
//     result.description = item.description;
//     result.created = item.created;
//     result.modified = item.modified;
//     return result;
// }
//
// function filterGetUserInfo(object) {
//     let result = object;
//     result.docs = filterUsersInfo(object.docs);
//     return result;
// }
// function filterUsersInfo(items) {
//     let result = [];
//     for(let item of items){
//         result.push(filterUserInfo(item));
//     }
//     return result;
// }
// function filterUserInfo(item) {
//     let result = {};
//     result.id = item._id;
//     result.name = item.name;
//     result.username = item.username;
//     result.isAdmin = item.isAdmin;
//     result.folders = item.folders;
//     return result;
// }
//
// const serverSalt = "45%sAlT_";
//
// async function checkAuth(req, res, next) {
//     console.log(req.body);
//     let credentials = auth(req)
//     if (credentials) {
//         try {
//             console.log("checkAuth"+credentials.name);
//             const user = await userCtrl.getByUsername(credentials.name);
//             if (user && utils.sha512(credentials.pass,serverSalt).passwordHash === user.password) {
//                 req.user = user;
//             } else {
//                 res.statusCode = 401
//                 return utils.apierror(401,'Access denied',res);
//                 // return res.end('Access denied')
//             }
//             next();
//         } catch (e) {
//             res.statusCode = 500;
//             return utils.apierror(500,'Server error : ' ,res);
//             // return res.end('Server error : ' + e);
//         }
//     }else {
//         res.statusCode = 401
//         return utils.apierror(401,'Access denied' ,res);
//         // return res.end('Access denied')
//     }
// }
// async function checkAdmin(req, res, next) {
//     // let user = await userCtrl.getByUsername(auth(req).name);
//     let user = await userCtrl.getByUsername(req.user.username);
//     if(!user.isAdmin){
//         return utils.apierror(403,"forbidden",next);
//     }
//     next();
// }
//
//
// function markdown(text) {
//     var reader = new commonmark.Parser();
//     var writer = new commonmark.HtmlRenderer();
//     var parsed = reader.parse(text); // parsed is a 'Node' tree
// // transform parsed if you like...
//
//     return writer.render(parsed); // result is a String
// }
//
//api
    //drive
    //auth
    //users
module.exports = router;
