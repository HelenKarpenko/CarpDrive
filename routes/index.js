var express = require('express');
var router = express.Router();

const userCtrl = require('../controllers/usersController');
const folderCtrl = require('../controllers/folderController');
const imgCtrl = require('../controllers/imgController');
const utilities = require('../utilities/utilities')

const passport = require('passport');
const crypto = require('crypto');

const serverSalt = "45%sAlT_";

function sha512(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

// ресурс доступний всім користувачам, навіть неаутентифікованих
router.get('/',
    (req, res) => {
        res.render('index', {
            user: req.user,
            title: 'Cloud'
        });
    });

router.get('/admin',
    utilities.checkAuth,
    utilities.checkAdmin,
    (req, res) => {
        userCtrl.getAll()
            .then(data => {
                res.render('admin', {
                    user: req.user,
                    users: data,
                });
            })
            .catch(() => res.sendStatus(500));
    });

router.get('/register',
    (req, res) => res.render('register', {
        user: req.user,
    }));

router.post('/register',
    async (req, res) => {
        let passwordHash = sha512(req.body.password, serverSalt).passwordHash;
        let users=await userCtrl.getByUsername(req.body.username);
        console.log(users);
        if(users.length===0){
            userCtrl.create(req.body.name, req.body.username, passwordHash, false)
                .then(() => {
                    res.redirect('/');
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/register');
                });
        }else{
            console.log("+++++ false")
            // alert("Incorrect value");
            res.redirect('/register');
        }
    });

router.get('/login',
    (req, res) => res.render('login', {
        user: req.user
    }));

router.get('/logout',
    utilities.checkAuth,
    (req, res) => {
        req.logout();
        res.redirect('/');
    });

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));


router.get('/profile',
    utilities.checkAuth,
    async (req, res,next) => {
    try {
        let folders = await userCtrl.getAllFolder(req.user._id);
        let args = utilities.paginate(folders, (req.query.page) ? req.query.page : 1);
        args.user = req.user;
        args.folders = folders
        res.render('profile', args);
    }catch (e){
        console.log("!!!!!!!"+e);
        next(e);
    }
    });




module.exports = router;
