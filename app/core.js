

var ble = require('../configs/ble.js');
// var estimateLocationInterval = setInterval( estimateLocation, 1000);
function estimateLocation(){
    let distances_ble2bleStation = [
        //distance of ble1 to bleStation1 = { s_id: "", bd_addr: "", distance: ""},
        //distance of ble1 to bleStation2 = { s_id: "", bd_addr: "", distance: ""},

    ];
    // load station info ble.ble_stations 

    // foreach ble.ble in ble_station_id
    for(var i = 0; i < ble.ble.length; i++){
        let isobject_existed = false;
        for(var j = 0; j < distances_ble2bleStation.length; j++){
            if((ble.ble[i].s_id == distances_ble2bleStation[j].s_id) && (ble.ble[i].bd_addr == distances_ble2bleStation[j].bd_addr)){
                distances_ble2bleStation[j].distance = rssi2distance(1, ble.ble[i].rssi)//*** p!?
                isobject_existed = true;
            }
            if(!isobject_existed){
                distances_ble2bleStation[distances_ble2bleStation.length] = {
                    s_id: ble.ble[i].s_id,
                    bd_addr: ble.ble[i].bd_addr,
                    distance: rssi2distance(1, ble.ble[i].rssi)//*** p!?
                }
            }
        }
    }
    let locations_ble = [
        //ble1_location,
        //ble2_location,
        //...
    ];//ble_location = { bd_addr: "", x: "", y: "" }
    //foreach space location to check x, y is satisfied all distance condiction
    for(var x = 0; x < 100; x++){
        for(var y = 0; y < 100; y++){
            if(true){
                locations_ble[k] = { bd_addr: "", x: x, y: y};
            }
        }
    }
    console.log("estimateLocation");
}
// var bleyserUpdateInterval = setInterval( bleUserUpdate, 60000);
function bleUserUpdate(){
    //db join query db
    //update ble.ble_stations 
}

//ble station update needed?

function rssi2distance(p, rssi){
    var n = 2;//(n ranges from 2 to 4)
    var distance = Math.pow(10, ((p - rssi)/(10 * n))); 
    return distance;
    //計算 https://forums.estimote.com/t/use-rssi-measure-the-distance/3665
}