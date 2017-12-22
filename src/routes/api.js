const express = require('express');
let router = express.Router();
const passport=require('passport');
// const Utils = require('@utils');
// const config = require('@config');

router.use('/v1/my-drive',passport.authenticate(['basic','bearer-access'],{session:false}),require('@APIv1/myDrive'));
router.use('/v1/user',passport.authenticate(['basic','bearer-access'],{session:false}),require('@APIv1/user'));
router.use('/v1/shared',passport.authenticate(['basic','bearer-access'],{session:false}), require('@APIv1/sharedWithMe'));
router.use('/v1/auth', require('@APIv1/auth'))

module.exports = router;