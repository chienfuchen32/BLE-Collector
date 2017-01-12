var globals = require('../globals/globals.js');
class Core {
    /*handle 1.initial and update globals/globals.bles(update data from api.info_collector periodical), 
         2.initial and update globals/globals.ble_staions(watch db update), 
         3.calculate front-end json data and emit on socket.io to send
                    type1 {bd_addr:'',distance:[{s_bd_addr:'',distance:d},...],locations:[]}
                    type2 {bd_addr:'',distance:[],locations[{x:x,y:y},...]}
                    type3 {bd_addr:'',distance:[],locations:[]}
    */
    // this.n_environment = '';
    // this.meters_error_tolerance_estimate = '';
    constructor() {
        this.n_environment = 2;//signal propagation constant
        this.meters_error_tolerance_estimate = 2;//in meters
        this.estimateInterval = 5000;
        // Core.rssi02distance('','','');
        // super(n_environment, meters_error_tolerance_estimate);
    }
    estimateStart(){
        globals.area = { width: 50, height: 50, meters_unit: 1};
        setInterval(Core.estimateLocation.bind(this), this.estimateInterval);
    }
    static estimateLocation(){
        const meters_error_tolerance_estimate = this.meters_error_tolerance_estimate;
        const n_environment = this.n_environment;
        let distances_bles2bleStations = [
            /*distance of ble1 to bleStation1 = { bd_addr: '', ble_staions: [{s_bd_addr: '', tx_power: '', rssi: '', distance: d}, {s_bd_addr: '', tx_power: '', rssi: '', distance: d}]},
            ...*/];//****if necessary(like complexity of algorithm), change data structure like 2 dimension object ble:'bd_addr1',station:[{ble_stations:''},{}],ble:'bd_addr2',station:[]
        if(globals.ble_stations.length!=0){//to prevent async data exchange from db exception event
            //or try to lock globals.ble_stations https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
            // foreach globals.bles in ble_station_id
            // try to lock globals.bles https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
            for(let i = 0; i < globals.bles.length; i++){
                distances_bles2bleStations[i] = {
                    bd_addr : globals.bles[i].bd_addr,
                    ble_stations: []
                };
                for(let j = 0; j < globals.bles[i].ble_stations.length; j++){
                    let isobject_existed = false;
                    let distance = '';
                    if((globals.bles[i].ble_stations[j].tx_power!='')&&(globals.bles[i].ble_stations[j].rssi!='')){
                        distance = Core.rssi2distance(globals.bles[i].ble_stations[j].tx_power, globals.bles[i].ble_stations[j].rssi, n_environment);//**** only if tx_power existed;
                    }
                    distances_bles2bleStations[i].ble_stations[j] = {
                        s_bd_addr: globals.bles[i].ble_stations[j].s_bd_addr,
                        tx_power: globals.bles[i].ble_stations[j].tx_power,
                        rssi: globals.bles[i].ble_stations[j].rssi,
                        distance: distance
                    }
                }
            }
            let locations_bles = [
                /*  // type1 {bd_addr:"",distance:[{s_bd_addr:"",distance:d},...],locations:[]}, 
                    // type2 {bd_addr:"",distances:[],locations[{x:x,y:y},...]}, 
                    // type3 {bd_addr:"",distances:[],locations:[]}*/];
            // foreach space location to check x, y is satisfied all distance condiction
            //try to lock globals.area https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
            for(let i = 0; i < distances_bles2bleStations.length; i++){
                let count_distance_WellFormat = 0;
                for(let j = 0; j < distances_bles2bleStations[i].ble_stations.length; j++){
                    if(distances_bles2bleStations[i].ble_stations[j].distance!=''){
                        count_distance_WellFormat++;
                    }
                }
                if(count_distance_WellFormat == 0){
                    for(let k = 0; k < globals.bles.length; k++){
                        if(globals.bles[k].bd_addr == distances_bles2bleStations[i].bd_addr){
                            locations_bles[i] = { bd_addr: distances_bles2bleStations[i].bd_addr, addr_type: globals.bles[k].addr_type, type: globals.bles[k].type, company: globals.bles[k].company, name: globals.bles[k].name, ble_stations:[], distance:[], locations:[]};
                            for(let l = 0; l < globals.bles[k].ble_stations.length; l++){    
                                locations_bles[i].ble_stations[l] = {
                                    s_bd_addr: globals.bles[k].ble_stations[l].s_bd_addr,
                                    tx_power: globals.bles[k].ble_stations[l].tx_power,
                                    rssi: globals.bles[k].ble_stations[l].rssi,
                                    datetime: globals.bles[k].ble_stations[l].datetime
                                }
                            }
                            break;
                        }
                    }
                }
                else if(count_distance_WellFormat == 1){
                    for(let j = 0; j < distances_bles2bleStations[i].ble_stations.length; j++){
                        if(distances_bles2bleStations[i].ble_stations[j].distance!=''){
                            for(let k = 0; k < globals.bles.length; k++){
                                if(globals.bles[k].bd_addr == distances_bles2bleStations[i].bd_addr){
                                    locations_bles[i] = { bd_addr: distances_bles2bleStations[i].bd_addr, addr_type: globals.bles[k].addr_type, type: globals.bles[k].type, company: globals.bles[k].company, name: globals.bles[k].name, ble_stations:[], distance:[{ s_bd_addr: distances_bles2bleStations[i].ble_stations[j].s_bd_addr, distance: distances_bles2bleStations[i].ble_stations[j].distance}], locations:[]};
                                    for(let l = 0; l < globals.bles[k].ble_stations.length; l++){
                                        locations_bles[i].ble_stations[l] = {
                                            s_bd_addr: globals.bles[k].ble_stations[l].s_bd_addr,
                                            tx_power: globals.bles[k].ble_stations[l].tx_power,
                                            rssi: globals.bles[k].ble_stations[l].rssi,
                                            datetime: globals.bles[k].ble_stations[l].datetime
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                else{
                    let Is_in_meters_error_tolerance_estimate = false;
                    for(let j = 0; j < distances_bles2bleStations[i].ble_stations.length; j++){
                        if(distances_bles2bleStations[i].ble_stations[j].distance!=''){
                            for(let x = 0; x < globals.area.width; x++){
                                for(let y = 0; y < globals.area.height; y++){
                                    if(Math.sqrt(Math.pow(x,2) + Math.pow(y,2))<=meters_error_tolerance_estimate){
                                        locations_bles[i] = { bd_addr: distances_bles2bleStations[i].bd_addr, addr_type: globals.bles[k].addr_type, type: globals.bles[k].type, company: globals.bles[k].company, name: globals.bles[k].name, ble_stations:[], distance:[], locations:[{ x: x, y: y}]};
                                        Is_in_meters_error_tolerance_estimate = true;
                                    }
                                }
                            }
                            for(let l = 0; l < globals.bles[k].ble_stations.length; l++){
                                locations_bles[i].ble_stations[l] = {
                                    s_bd_addr: globals.bles[k].ble_stations[l].s_bd_addr,
                                    tx_power: globals.bles[k].ble_stations[l].tx_power,
                                    rssi: globals.bles[k].ble_stations[l].rssi,
                                    datetime: globals.bles[k].ble_stations[l].datetime
                                }
                            }
                        }
                    }
                    if(!Is_in_meters_error_tolerance_estimate){
                        for(let k = 0; k < globals.bles.length; k++){
                            if(globals.bles[k].bd_addr == distances_bles2bleStations[i].bd_addr){
                                locations_bles[i] = { bd_addr: distances_bles2bleStations[i].bd_addr, addr_type: globals.bles[k].addr_type, type: globals.bles[k].type, company: globals.bles[k].company, name: globals.bles[k].name, ble_stations:[], distance:[], locations:[]};
                                for(let l = 0; l < globals.bles[k].ble_stations.length; l++){
                                    locations_bles[i].ble_stations[l] = {
                                        s_bd_addr: globals.bles[k].ble_stations[l].s_bd_addr,
                                        tx_power: globals.bles[k].ble_stations[l].tx_power,
                                        rssi: globals.bles[k].ble_stations[l].rssi,
                                        datetime: globals.bles[k].ble_stations[l].datetime
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
            //sort by distance? datetime? http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
            globals.locations_bles = locations_bles;
            // console.log(locations_bles)
        }
    }
    // var bleyserUpdateInterval = setInterval( bleUserUpdate, 60000);
    bleUserUpdate(){
        //db join query db
        //update globals.ble_stations 
    }
    bleStationsUpdate(){
        //get ble_staions from db
        var ble_stationModel = require('../model/ble_stations.js');
        ble_stationModel.find({}, function (err, ble_station) {
            if (err){
                console.error('Core.bleStationsUpdate error: ' + err);
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
    static rssi02distance(rssi0, rssi, d0, n){ //d0 distance in meters
        // const n = this.n_environment;//(n ranges from 2 to 4)
        // let d = d0 * Math.pow(10, (rss0 - rssi)/(10 * n))
        //Derivation

        //Algorithm
        //least square https://www.gitbook.com/book/hom-wang/indoorpositioning-ls/details
        //http://oplab.im.ntu.edu.tw/csimweb/system/application/views/files/ICIM/20120242
        //training https://nccur.lib.nccu.edu.tw/retrieve/82504/024101.pdf
    }
    static rssi2distance(tx_power, rssi, n){
        let distance = Math.pow(10, ((tx_power - rssi)/(10 * n)));
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