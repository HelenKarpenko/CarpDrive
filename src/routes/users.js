var express = require('express');
var router = express.Router();

const folderCtrl = require('../controllers/folderController');
const fileCtrl = require('../controllers/fileController');
const imgCtrl = require('../controllers/fileDataController');
const userCtrl = require('../controllers/usersController');
const utilities = require('../utilities/utilities');

router.get('/',
    utilities.checkAuth,
    utilities.checkAdmin,
    (req, res) => {
        userCtrl.getAll()
            .then(data => {
                let args = utilities.paginate(data,(req.query.page) ? req.query.page : 1);
                args.users = data;
                args.user = req.user;

                res.render('users', args);
            })
            .catch(() => res.sendStatus(500));
    });

const adminId = '5a0c9091180b171fde9b15d8'
function checkAdmin(req) {
    console.log("CHECKADMIN  " + req.user._id + " "+ adminId);
    if((String)(req.user._id) === (String)(adminId)) return true;
    return false;
}

router.get('/u:id',
    utilities.checkAuth,
    utilities.checkAdmin,
    async (req, res,next) => {
        userCtrl.getById(req.params.id)
            .then(user => {
                res.render('user', {
                    user: user,
                    admin: req.user,
                });
            })
            .catch(e => console.log(e));
});

router.get('/u:id/removeUser',utilities.checkAuth,utilities.checkAdmin, async(req, res, next) => {
    try{
        console.log("++++++" + req.params.id);
        let user = await userCtrl.getById(req.params.id);
        let folder = await folderCtrl.getById(user.folder);
        res.render('removeUser', {
            warning: "When you delete this user "+ user.name +" ("+ user._id +"), delete his/her folder "+ folder.name+" ("+folder._id +") !",
            user: user,
            folder: folder
        });
    }catch(e){
        console.log(e);
    }
});

router.post('/u:id/removeUser',utilities.checkAuth,utilities.checkAdmin,utilities.checkAdminRemove,async(req, res, next) => {
    let user = await userCtrl.getById(req.params.id);
    folderCtrl.getById(user.folder)
        .then(folder => {
            folderCtrl.removeAll(user.folder)
                .then(()=>{
                    folderCtrl.remove(user.folder)
                        .then(()=>
                            userCtrl.remove(req.params.id)
                                .then(()=>res.redirect('/')));
                })

        })
        .catch(err => utilities.error(500,"Some error at server, when remove",next));
});

module.exports = router;