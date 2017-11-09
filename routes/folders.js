var express = require('express');
var router = express.Router();
let fs = require('fs-promise');
let document = require('document');
const folder = require('../modul/folder_storage');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.redirect('/folders/page=1');
// });

router.get('/f:id', function(req, res, next) {
    Promise.all([
        folder.getAll(),
        folder.getById(req.params.id)
    ])
        .then(([p1, p2]) => res.render('f', {folders: p1, folder:p2}))
        .catch(err => {
            console.log("Error: " + err);
            next();
        })
});

router.post('/remove/:id', function(req, res, next) {
    folder.remove(Number(req.params.id))
        .catch(err => console.error(err));
    res.redirect('/folders');
});

router.get('/add', function(req, res, next) {
    folder.getById(1)
        .then(data => res.render('add', {folder: data}))
        .catch(err => {
            console.log("Error: " + err);
            next();
        })
});

router.post('/add',function (req,res,next) {
    let imgFile = req.files.img;
    fs.writeFile("public/images/uploads/"+imgFile.name, imgFile.data);
    folder.create("uploads/"+imgFile.name, req.body.name, req.body.size, req.body.type, req.body.location, req.body.owner, req.body.description)
        .catch(err => console.error(err));
    res.redirect('/folders');
})

// router.get('/search' , function (req, res, next){
//     folder.getAll()
//         .then(data => {
//             let folders = [];
//             for(let f of data){
//                 if(f.name === req.query.name){
//                     folders.push(f);
//                 }
//             }
//     console.log('>>>>> folders = '+JSON.stringify(folders));
//             res.redirect('/folders/search/page=1');
//             res.render('search', {folders: folders})
//         })
//         .catch(err => {
//             console.log("Error: " + err);
//             next();
//         })
// });
router.get('/search/', function (req, res, next) {
    console.log("++++++++++++++++++ /search/page="+ req.params.page)
    folder.getAll()
        .then(data => {
            let folders=data.filter((e)=>{return e.name.toLowerCase().startsWith(req.query.name.toLowerCase())});
            console.log('>>>>> folders = '+JSON.stringify(folders));
            res.render('search', paginate(folders, (req.query.page)?req.query.page:1,`&name=${req.query.name}`));
        })
        .catch(err => {
            console.log("Error: " + err);
            next();
        })
});

router.get('/', function (req, res, next) {
    folder.getAll()
        .then(data => res.render('folders', paginate(data, (req.query.page)?req.query.page:1),))
        .catch(err => {
            console.log("Error: " + err);
            next();
        });
});

const itemsCount = 4;
const pagesRange = 4;

function paginate(items, page,subURL) {
    let args = {};
    let startItem = (page - 1) * itemsCount;
    args.pageCount = Math.trunc(items.length / itemsCount) + ((items.length % itemsCount > 0) ? 1 : 0);
    args.items = items.slice(startItem, startItem + itemsCount);
    args.currentPage = page;
    args.range = pagesRange;
    args.subURL=subURL;
    console.log('========================================')
    console.log('>>>>> args.pageCount = '+args.pageCount);
    console.log('>>>>> args.items = '+JSON.stringify(args.items));
    console.log('>>>>> args.currentPage = '+args.currentPage);
    console.log('>>>>> args.range = '+args.range);

    return args;
}



module.exports = router;