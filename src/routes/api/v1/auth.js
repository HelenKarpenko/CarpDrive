const express = require('express');
let router = express.Router();
const passport = require('passport');
const userCtrl = require('../../../storage/controllers/usersController');
const folderCtrl = require('../../../storage/controllers/folderController');

let tools = {};
tools.collectDataFromReq = {
    register (req) {
        let args = {};
        args.name = req.body.name;
        args.username = req.body.username;
        args.password = req.body.password;
        return args;
    }
};
tools.verifyData = {
    register (args) {
        if (!args.name/* || !validate(args.username)*/) {
            // throw Utils.errors.InvalidRequesDatatError('Your username is invalid')
            console.log('Your username is invalid');
        }
        if (!args.username/* || !validate(args.username)*/) {
            // throw Utils.errors.InvalidRequesDatatError('Your username is invalid')
            console.log('Your username is invalid');
        }
        if (!args.password /*|| !validate(args.password)*/) {
            // throw Utils.errors.InvalidRequesDatatError('Your password is invalid')
            console.log('Your password is invalid');
        }
        return true;
    }
}

router.post('/register', async function (req, res, next) {
    const args = tools.collectDataFromReq.register(req);
    try{
        tools.verifyData.register(args);
    }catch (err){
        console.log(err);
        // return Utils.sendError(res, 400, err.message);
    }
    try{
        let user = await userCtrl.create(args.name, args.username, args.password);
        let folder = await  folderCtrl.create(
            await folderCtrl.getMainFolder(),
            `${args.name} folder`,
            user._id,
            `${args.name} folder`);
        await userCtrl.addMainFolder(user, folder._id);
        return res.json(
            {
                success: true,
                tokens: {
                    access: user.accessToken,
                    refresh: user.refreshToken,
                }
            });
    }catch (err) {
        if (err.code == 11000) {
            // return Utils.sendError(res, 400, "This username is already taken");
            console.log("This username is already taken");
        } else {
            // return Utils.sendError(res, 500, "Server error");
            console.log("Server error"+err);
        }
    }
});

router.post('/login', passport.authenticate('basic', {session: false}), async (req, res, next) => {
    try {
        req.user.generateAccessToken();
        req.user.generateRefreshToken();
        await req.user.save();

        res.json({
            success: true,
            user: req.user.minInfo(),
            tokens: {
                access: req.user.accessToken,
                refresh: req.user.refreshToken
            },
        });
    } catch (err) {
        console.log(err);
        // return Utils.sendError(res, 500, "Server error");
    }
});

router.post('/logout', passport.authenticate(['basic', 'bearer-access'], {session: false}), async (req, res, next) => {
    req.user.generateAccessToken();
    req.user.generateRefreshToken();

    await req.user.save();
    return res.json({success: true});
});

router.get('/token', passport.authenticate('bearer-refresh', {session: false}), async (req, res, next) => {
    req.user.generateAccessToken();
    await req.user.save();
    return res.json(
        {
            success: true,
            tokens: {
                access: req.user.accessToken,
            }
        });
})

module.exports = router;