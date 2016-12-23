var api = require('../api/api.js');
var express = require('express');
var router = express.Router();

router.post('/test', api.test);
router.post('/update_info', api.info_collector);

module.exports = router;