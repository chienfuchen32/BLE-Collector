var ble = require('../configs/ble.js');
// var estimateLocationInterval = setInterval( estimateLocation, 1000);
function estimateLocation(){
    let distances_ble2bleStation = [
        //distance of ble1 to bleStation1 = { s_bd_addr: "", bd_addr: "", distance: ""},
        //distance of ble1 to bleStation2 = { s_bd_addr: "", bd_addr: "", distance: ""},

    ];
    // load station info ble.ble_stations 

    // foreach ble.ble in ble_station_id
    for(var i = 0; i < ble.ble.length; i++){
        let isobject_existed = false;
        for(var j = 0; j < distances_ble2bleStation.length; j++){
            if((ble.ble[i].s_bd_addr == distances_ble2bleStation[j].s_bd_addr) && (ble.ble[i].bd_addr == distances_ble2bleStation[j].bd_addr)){
                distances_ble2bleStation[j].distance = rssi2distance(ble.ble[i].tx_power, ble.ble[i].rssi)//**** only if tx_power existed
                isobject_existed = true;
            }
            if(!isobject_existed){
                distances_ble2bleStation[distances_ble2bleStation.length] = {
                    s_bd_addr: ble.ble[i].s_bd_addr,
                    bd_addr: ble.ble[i].bd_addr,
                    distance: rssi2distance(ble.ble[i].tx_power, ble.ble[i].rssi)//**** only if tx_power existed
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
                locations_ble[k] = { bd_addr: "", locations:[{x: x, y: y}]};
                //or
                locations_ble[k] = { bd_addr: "", distance:[{s_bd_addr:"",distance:""}]};
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

const n_environment = 2; //signal propagation constant 
//ble station update needed?
function rssi02distance(rssi0, rssi, d0){ //d0 distance in meters
    let n = n_environment;
    let d = d0 * Math.pow(10, (rss0 - rssi)/(10 * n))
    //Derivation
    //https://www.gitbook.com/book/hom-wang/indoorpositioning-ls/details
}

function rssi2distance(p, rssi){
    let n = n_environment;//(n ranges from 2 to 4)
    let distance = Math.pow(10, ((p - rssi)/(10 * n)));
    return distance;
    //real world sample http://www.arthurtoday.com/2014/10/howtouseibeaconpart1.html
    //Calculation fomular https://forums.estimote.com/t/use-rssi-measure-the-distance/3665
    // http://www.rn.inf.tu-dresden.de/dargie/papers/icwcuca.pdf
    // http://stackoverflow.com/questions/22784516/estimating-beacon-proximity-distance-based-on-rssi-bluetooth-le/24245724#24245724
    // https://forums.estimote.com/t/determine-accurate-distance-of-signal/2858
    //ios ref http://stackoverflow.com/questions/20416218/understanding-ibeacon-distancing/20434019#20434019
    /*protected static double calculateAccuracy(int txPower, double rssi) {
        if (rssi == 0) {
            return -1.0; // if we cannot determine accuracy, return -1.
        }

        double ratio = rssi*1.0/txPower;
        if (ratio < 1.0) {
            return Math.pow(ratio,10);
        }
        else {
            double accuracy =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;    
            return accuracy;
        }
    }   */
    //bios example https://lib-repos.fun.ac.jp/dspace/bitstream/10445/4797/2/siraisi_2010_1_ijis2_1.pdf
}