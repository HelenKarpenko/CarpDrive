var express = require('express');
var router = express.Router();

// ресурс доступний всім користувачам, навіть неаутентифікованих
router.get('/',
    (req, res) => {
        res.render('index', {
            user: req.user,
            title: 'Cloud'
        });
    });


module.exports = router;
