var mongoose = require('mongoose');
var areaModel = mongoose.model('ble_station', mongoose.Schema({
    addr_type: String, 
    bd_addr: String, 
    type: String, 
    company: String, 
    name: String, 
    tx_power: Number, 
    rssi: Number, 
    datetime: Date, 
    rssi_0: Number, 
    u_id: [String], 
},{ versionKey: false }));
module.exports = areaModel;

//define ble objec { addr_type: "", bd_addr: "", name: "", type: "", company: "", tx_power: "", rssi: "",  datetime: "", rssi_0m}