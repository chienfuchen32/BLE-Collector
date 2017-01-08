var mongoose = require('mongoose');
var areaModel = mongoose.model('ble_station', mongoose.Schema({
    width: Number,
    height: Number,
    meters_unit: Number,
},{ versionKey: false }));
module.exports = areaModel;