var api = require('../api/api.js');
var express = require('express');
var router = express.Router();

router.post('/add', api.addStation);
router.post('/edit', api.editStation);
router.post('/del', api.delStation);

module.exports = router;