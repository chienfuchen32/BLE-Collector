

// var CoreInterval = setInterval( test, 1000);
function test(){
    console.log("test");
}

function rssi2distance(p, rssi){
    var n = 2;//(n ranges from 2 to 4)
    var distance = Math.pow(10, ((p - rssi)/(10 * n))); 
    return distance;
    //計算 https://forums.estimote.com/t/use-rssi-measure-the-distance/3665
}