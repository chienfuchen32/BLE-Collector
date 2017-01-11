var api = require('../api/api.js');
var express = require('express'); var router = express.Router();

router.post('/find', api.findBleWatchList);
router.post('/edit', api.updateBleWatchList);

module.exports = router;