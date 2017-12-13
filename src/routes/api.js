const express = require('express');
let router = express.Router();

// const Utils = require('@utils');
// const config = require('@config');

router.use('/v1/my-drive', require('@APIv1/myDrive'));
router.use('/v1/auth', require('@APIv1/auth'))

module.exports = router;