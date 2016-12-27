var mongoose = require('mongoose');
var ble_stationModel = mongoose.model('ble_station', mongoose.Schema({
    id: String,//needed?
    bd_addr: String,
    name: String,
    x: Number,
    y: Number,
},{ versionKey: false }));
module.exports = ble_stationModel;