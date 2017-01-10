var mongoose = require('mongoose');
var stationschema = mongoose.Schema({
    s_bd_addr: String , 
    tx_power: String, //or Number
    rssi: String,  //or Number
    datetime: Date
}, { _id: false, versionKey: false});
var bleModel = mongoose.model('ble_station', mongoose.Schema({
    bd_addr: String, 
    addr_type: String, 
    type: String, 
    company: String, 
    name: String, 
    ble_stations:[stationschema],
    rssi_0: String,  //or Number
    main_s_bd_addr: String, 
    u_id: [String], 
},{ versionKey: false }));
module.exports = bleModel;