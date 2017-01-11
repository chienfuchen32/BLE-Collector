var mongoose = require('mongoose');
var ble_watch_list_Model = mongoose.model('ble_watch_list', mongoose.Schema({
    bd_addr: String, 
    addr_type: String, 
    type: String, 
    company: String, 
    name: String, 
    user_name: String
},{ versionKey: false }));
module.exports = ble_watch_list_Model;