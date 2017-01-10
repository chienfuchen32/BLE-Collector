var bles_native = [//****you might not need this
//  ble_native_object1 = { s_bd_addr: String, bles:[{ addr_type: String, bd_addr: String, type: String, company: String, name: String, tx_power: String, rssi: String,  datetime: String}]},
//  ble_native_object2,
//  ...
]
var bles = [
// ble_object1 = { bd_addr: String, addr_type: String, type: String, company: String, name: String, ble_staions: [{ s_bd_addr: String, tx_power: String, rssi: String, datetime: String }, {s_bd_addr: String, rssi: rssi, datetime: String}, ...] },
// ble_object2,
// ...
]
var ble_stations = [
    // ble_station1 = { bd_addr: String, name: String, x: Number, y: Number },
    // ble_station2,
    // ...
]
var area = {
    //width: w,
    //height: h,
    //meters_units,
}
var locations_bles = [
    // type1 {bd_addr: String, addr_type: String, type: String, company: String, name, distance:[{s_bd_addr:"",distance:d},...],locations:[]}, 
    // type2 {bd_addr: String, addr_type: String, type: String, company: String, name, distance:[],locations[{x:x,y:y},...]}, 
    // type3 {bd_addr: String, addr_type: String, type: String, company: String, name, distance:[],locations:[]}
]
module.exports = { bles_native, bles, ble_stations, area }//for realtime calculation