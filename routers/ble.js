var api = require('../api/api.js');
var express = require('express');
var router = express.Router();

router.post('/update_info', api.handle_peripheral);//ble info station sniffed/ 10s 

module.exports = router;