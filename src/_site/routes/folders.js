var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('folders');
});

router.get('/f:id', function(req, res, next) {
    folder.getById(req.params.id)
        .then(data => ejs.render('f',data))
        .catch(()=>next());
});

module.exports = router;
// // define the home page route
// router.get('/', function(req, res) {
//     res.send('Birds home page');
// });
// // define the about route
// router.get('/about', function(req, res) {
//     res.send('About birds');
// });