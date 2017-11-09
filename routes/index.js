var express = require('express');
var router = express.Router();


const folder = require('../modul/folder_storage');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cloud' });
});

module.exports = router;
