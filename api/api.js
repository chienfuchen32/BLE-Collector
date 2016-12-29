var validator = require('validator');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;//https://github.com/Automattic/mongoose/issues/4291
mongoose.connect('mongodb://localhost/zoodb');

//response -> status would be "OK" or "NG"
var ble = require('../configs/ble.js');
//ble
exports.info_collector = function(req, res) {//handle ble info staion sniffed
    var response = { status: "OK", message:"" };
    var IsWellFormat = true;
    //get http parameter to update ble
    let IbleExisted = false;
    for(var i = 0; i < ble.ble.length; i++){
        if(ble.ble[i].bd_addr == req.body.bd_addr){
            ble.ble[i].tx_power = req.body.tx_power;
            ble.ble[i].rssi = req.body.rssi;
            ble.ble[i].datetime = req.body.datetime;
            IbleExisted = true;
        }
    }
    if(!IbleExisted){
        ble.ble[ble.ble.length] = {
            device_name: req.body.device_name, 
            addr_type: req.body.addr_type, 
            bd_addr: req.body.bd_addr, 
            type: req.body.type, 
            company: req.body.company, 
            tx_power: req.body.tx_power,
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

//ble station
exports.addStation = function(req, res) {
  var response = { status: "OK", message:"" };//if proccess status would be "OK" or "NG"
  var IsWellFormat = true;
  const bd_addr = req.body.bd_addr;
  const name = req.body.name;
  const x = req.body.x;
  const y = req.body.y;
  
  try{
    if((typeof x != "undefined") && (!validator.isInt(x))){
      throw "x format wrong";
    }
    if((typeof y != "undefined") && (!validator.isInt(y))){
      throw "y format wrong";
    }
  }
  catch(err){
    IsWellFormat = false;
    response = { status : "NG", message : err.message };
  }
  if(IsWellFormat) {
    var db = mongoose.connection;
    // db.on('error', console.error.bind(console, 'connection error:'));//因為遇到http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected 所以把這個關閉
    // db.once('open', function() {
    //   // console.log('connected');
    // });
    var ble_stationModel = require("../model/ble_station.js");
    // check if bd_addr existed
    var Is_bd_addr_Existed = false;
    var query = ble_stationModel.findOne({ 'bd_addr': bd_addr });
    query.select('name');
    query.exec(function (err, ble_station) {
      if (err) return handleError(err);
      if(ble_station != null)
        Is_bd_addr_Existed = true;
      if(Is_bd_addr_Existed){
        response = { status : "NG", message : "bd_addr is already existed" };
        res.json(response);
      }
      else{
        //insert data to mongodb
        var ble_station = new ble_stationModel({
            bd_addr: bd_addr,
            name: name,
            x: x,
            y: y
        });
        user.save(function(err){
          if(err){
            response = { status : "NG", message : err };
          }
          res.json(response);
        });
      }
    })
  }
  else {
      res.json(response);
  }
}
exports.editStation = function(req, res) {
  var response = { status: "OK", message:"" };//if proccess status would be "OK" or "NG"
  var IsWellFormat = true;
  const bd_addr = req.body.bd_addr;
  const name = req.body.name;
  const x = req.body.x;
  const y = req.body.y;
  
  try{
    if((typeof x != "undefined") && (!validator.isInt(x))){
      throw "x format wrong";
    }
    if((typeof y != "undefined") && (!validator.isInt(y))){
      throw "y format wrong";
    }
  }
  catch(err){
    IsWellFormat = false;
    response = { status : "NG", message : err.message };
  }
  if(IsWellFormat) {
    var db = mongoose.connection;
    // db.on('error', console.error.bind(console, 'connection error:'));//因為遇到http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected 所以把這個關閉
    // db.once('open', function() {
    //   // console.log('connected');
    // });
    // var ble_stationModel = require("../model/ble_station.js");
    // // check if bd_addr existed
    // var Is_bd_addr_Existed = false;
    // var query = ble_stationModel.findOne({ 'bd_addr': bd_addr });
    // query.select('name');
    // query.exec(function (err, ble_station) {
    //   if (err) return handleError(err);
    //   if(ble_station != null)
    //     Is_bd_addr_Existed = true;
    //   if(Is_bd_addr_Existed){
    //     response = { status : "NG", message : "bd_addr is already existed" };
    //     res.json(response);
    //   }
    //   else{
    //     //insert data to mongodb
    //     var ble_station = new ble_stationModel({
    //         bd_addr: bd_addr,
    //         name: name,
    //         x: x,
    //         y: y
    //     });
    //     user.save(function(err){
    //       if(err){
    //         response = { status : "NG", message : err };
    //       }
    //       res.json(response);
    //     });
    //   }
    // })
  }
  else {
      res.json(response);
  }
}
