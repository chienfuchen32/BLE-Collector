var api = require('../api/api.js');
var express = require('express'); var router = express.Router();

router.post('/edit', api.editArea);//ble info station sniffed/ 10s

module.exports = router;
