var mongoose = require('mongoose');
var phoneschema = mongoose.Schema(
    { phone_type: String , country_code: String, number: Number }, { _id: false, versionKey: false});
var userModel = mongoose.model('user', mongoose.Schema({
    name: { first: String, last: String },
    nickname: String,
    gender: Number,//ISO 5218
    id: String,//人工unique key
    password: String,
    email: String,
    contact: { phone: [ phoneschema ] },
    photo_path: String,
    ble_devices: Array,
    create_datetime: Date,//ref http://stackoverflow.com/questions/11973304/mongodb-mongoose-querying-at-a-specific-date
    update_datetime: Date,//db.getCollection('users').find({update_datetime: { $gt: ISODate("2016-01-08") }})
    // last_login_ip: String,
},{ versionKey: false }));
module.exports = userModel;