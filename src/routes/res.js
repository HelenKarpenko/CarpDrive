var express = require('express');
var router = express.Router();

const imgCtrl = require('../controllers/fileController');
/* GET home page. */
router.get('/images/:id', async function(req, res, next) {
    try{
        let image=await imgCtrl.getById(req.params.id+"");
                res.type(image.filename.split('.').pop());
            image.stream.pipe(res);
    }catch (e){
        res.status(404);
        next();
    }
});

module.exports = router;
