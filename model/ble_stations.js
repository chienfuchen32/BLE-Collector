var mongoose = require('mongoose');
var ble_stationModel = mongoose.model('ble_station', mongoose.Schema({
    bd_addr: String,
    name: String,
    x: Number,
    y: Number,
    // register_ble: Boolean,//
},{ versionKey: false }));
module.exports = ble_stationModel;