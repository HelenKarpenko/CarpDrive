const express = require('express');
let router = express.Router();

// const Utils = require('@utils');
// const config = require('@config');

router.use('/v1/items', require('@APIv1/items'))

module.exports = router;