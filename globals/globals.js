var bles_native = [
//  ble_native_object1 = { s_bd_addr: "", bles:[{ addr_type: "", bd_addr: "", type: "", company: "", name: "", tx_power: tx_power, rssi: rssi,  datetime: ""}]},
//  ble_native_object2,
//  ...
]
var bles = [
// ble_object1 = { bd_addr: "", addr_type: "", bd_addr: "", type: "", company: "", name: "", tx_power: tx_power, ble_staions: [{ s_bd_addr: "", rssi: rssi, datetime: "" }, {s_bd_addr: "", rssi: rssi, datetime: ""}, ...] },
// ble_object2,
// ...
]
var ble_stations = [
    // ble_station1 = { bd_addr: "", name: "", x: x, y: y },
    // ble_station2,
    // ...
]
var area = {
    //width: w,
    //height: h,
    //meters_units,
}
module.exports = { bles, ble_stations, area }//for realtime calculation