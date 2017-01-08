var api = require('../api/api.js');
var express = require('express');
var router = express.Router(); 

router.post('/add', api.addUser);
router.post('/edit', api.editUser);
router.post('/del', api.delUser);

module.exports = router;
