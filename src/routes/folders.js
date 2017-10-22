var express = require('express');
var router = express.Router();

const folder = require('../modul/folder_storage');
/* GET users listing. */
router.get('/', function(req, res, next) {
    folder.getAll()
        .then(data => res.render('folders', {folders: data}))
        .catch(err => {
            console.log("Error: " + err);
            next();
        })
});

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
module.exports = router;