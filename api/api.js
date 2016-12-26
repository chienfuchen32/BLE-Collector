//response -> status would be "OK" or "NG"
var ble = require('../configs/ble.js');
exports.info_collector = function(req, res) {//handle ble info staion sniffed
    var response = { status: "OK", message:"" };
    var IsWellFormat = true;
    //get http parameter to update ble
    let IbleExisted = false;
    for(var i = 0; i < ble.ble.length; i++){
        if((ble.ble[i].s_id == req.body.s_id) && (ble.ble[i].bd_addr == req.body.bd_addr)){
            ble.ble[i].rssi = req.body.rssi;
            ble.ble[i].datetime = req.body.datetime;
            IbleExisted = true;
        }
    }
    if(!IbleExisted){
        ble.ble[ble.ble.length] = {
            s_id: req.body.s_id,
            device_name: req.body.device_name, 
            addr_type: req.body.addr_type, 
            bd_addr: req.body.bd_addr, 
            type: req.body.type, 
            company: req.body.company, 
            rssi: req.body.rssi,  
            datetime: req.body.datetime
        }
    }
    res.json(response);
    
}
exports.test = function(req, res) {
    var response = { status: "OK", message:"" };
    var IsWellFormat = true;
    res.json(response);
}