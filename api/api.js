//response -> status would be "OK" or "NG"

exports.info_collector = function(req, res) {
    var response = { status: "OK", message:"" };
    var IsWellFormat = true;
    //get http parameter to update ble_list
    var ble = require('../configs/ble.js');
    let IbleExisted = false;
    for(var i = 0; i < ble.ble_list.length; i++){
        if(ble.ble_list[i].bd_addr == req.body.bd_addr){
            ble.ble_list[i].rssi = req.body.rssi;
            IbleExisted = true;
        }
    }
    if(!IbleExisted){
        ble.ble_list[ble.ble_list.length] = {
            bd_addr: req.body.bd_addr,
            rssi: req.body.rssi,
        }
    }
    response.message = ble.ble_list;
    res.json(response);
}