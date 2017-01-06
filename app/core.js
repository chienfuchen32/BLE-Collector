var globals = require('../globals/globals.js');
class Core {
    /*handle 1.initial and update globals/globals.bles(update data from api.info_collector periodical), 
         2.initial and update globals/globals.ble_staions(watch db update), 
         3.calculate front-end json data and emit on socket.io to send
                    type1 {bd_addr:"",distance:[{s_bd_addr:"",distance:d},...],locations:[]}
                    type2 {bd_addr:"",distance:[],locations[{x:x,y:y},...]}
                    type3 {bd_addr:"",distance:[],locations:[]}
    */
    constructor() {
        this.n_environment = 2; //signal propagation constant 
    }
    estimateLocation(){
        let distances_bles2bleStations = [
            /*distance of ble1 to bleStation1 = { bd_addr: "", s_bd_addr: "", distance: ""},
            distance of ble1 to bleStation2 = { bd_addr: "", s_bd_addr: "", distance: ""},...*/];
        if(globals.ble_stations.length!=0){//to prevent async data exchange from db exception event
            //or try to lock globals.ble_stations https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
            // foreach globals.bles in ble_station_id
            // try to lock globals.bles https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
            for(var i = 0; i < globals.bles.length; i++){
                let isobject_existed = false;
                let distance = "";
                if((globals.bles[i].tx_power!="")&&(globals.bles[i].rssi!="")){
                    distance = rssi2distance(globals.bles[i].tx_power, globals.bles[i].rssi)//**** only if tx_power existed;
                }
                for(var j = 0; j < distances_bles2bleStations.length; j++){
                    if((globals.bles[i].s_bd_addr == distances_bles2bleStations[j].s_bd_addr) && (globals.bles[i].bd_addr == distances_bles2bleStations[j].bd_addr)){
                        distances_bles2bleStations[j].distance = distance;
                        isobject_existed = true;
                    }
                }
                if(!isobject_existed){
                    distances_bles2bleStations[distances_bles2bleStations.length] = {
                        bd_addr: globals.bles[i].bd_addr,
                        s_bd_addr: globals.bles[i].s_bd_addr,
                        distance: distance
                    }
                }
            }
            let locations_ble = [
                /*ble1_location = { bd_addr: "", x: "", y: "" },
                ble2_location = { bd_addr: "", x: "", y: "" },
                ...*/];
            //foreach space location to check x, y is satisfied all distance condiction

            for(var x = 0; x < globals.area.width; x++){
                for(var y = 0; y < globals.area.height; y++){
                    if(true){
                        locations_ble[k] = { bd_addr: "", distance:[], locations:[{x: x, y: y}]};
                        //or
                        locations_ble[k] = { bd_addr: "", distance:[], distance:[{s_bd_addr:"",distance:""}]};
                        //or
                        locations_ble[k] = { bd_addr: "", distance:[], locations:[]};
                    }
                }
            }
        }
    }
    // var bleyserUpdateInterval = setInterval( bleUserUpdate, 60000);
    bleUserUpdate(){
        //db join query db
        //update globals.ble_stations 
    }
    bleStationsUpdate(){
        //get ble_staions from db
        var ble_stationModel = require("../model/ble_stations.js");
        ble_stationModel.find({}, function (err, ble_station) {
            if (err){
                console.error("Core.bleStationsUpdate error: " + err);
            }
            else{
                globals.ble_stations = [];
                for(let i = 0; i < ble_station.length; i++){
                    globals.ble_stations[i] = { bd_addr: ble_station[i].bd_addr, name: ble_station[i].name, x: ble_station[i].x, y: ble_station[i].y }
                }
                // console.log(globals.ble_stations);
            }
        });
    }
    //ble station update needed?
    rssi02distance(rssi0, rssi, d0){ //d0 distance in meters
        // let n = this.n_environment;//(n ranges from 2 to 4)
        // let d = d0 * Math.pow(10, (rss0 - rssi)/(10 * n))
        //Derivation
        //https://www.gitbook.com/book/hom-wang/indoorpositioning-ls/details
    }
    rssi2distance(p, rssi){
        let n = this.n_environment;//(n ranges from 2 to 4)
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
}
module.exports = Core;