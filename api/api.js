var validator = require('validator');
//response -> status would be "OK" or "NG"
var globals = require('../globals/globals.js');
exports.info_collector = function(req, res) {//handle ble info staion sniffed then update globals/globals.bles
  //****please lock globals.bles https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
  try{
    var response = { status: "OK", message:"" };
    var IsWellFormat = true;
    //get http parameter to update ble
    let IbleExisted = false;
    let ble_list = req.body.ble_list;
    //****delete globals.bles where (globals.bles[i].datetime).substract(Date.now()) > 1 minute
    for(let i  = 0; i < ble_list.length; i++){
      for(let j = 0; j < globals.bles.length; j++){
          if((globals.bles[j].s_bd_addr == ble_list[i].s_bd_addr) && (globals.bles[j].bd_addr == ble_list[i].bd_addr)){
              globals.bles[j].tx_power = ble_list[i].tx_power;
              globals.bles[j].rssi = ble_list[i].rssi;
              globals.bles[j].datetime = ble_list[i].datetime;
              IbleExisted = true;
          }
      }
      if(!IbleExisted){
          globals.bles[globals.bles.length] = {
              s_bd_addr: req.body.s_bd_addr, 
              addr_type: ble_list[i].addr_type, 
              bd_addr: ble_list[i].bd_addr, 
              type: ble_list[i].type, 
              company: ble_list[i].company, 
              name: ble_list[i].name, 
              tx_power: ble_list[i].tx_power, 
              rssi: ble_list[i].rssi, 
              datetime: ble_list[i].datetime
          }
      }
    }
    console.log(globals.bles)
    res.json(response);
  }
  catch(err){

  }}
//ble station
exports.findStation = function(req, res){
  var response = { status: "OK", message: "" };//if proccess status would be "OK" or "NG"
  var ble_stationModel = require("../model/ble_stations.js");
  ble_stationModel.find({}, function (err, ble_stations) {
    if (err){
      response = { status : "NG", message : err };
    }
    response.message = ble_stations;
    res.json(response);
  })}
exports.addStation = function(req, res) {
  var response = { status: "OK", message: "" };//if proccess status would be "OK" or "NG"
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
    var ble_stationModel = require("../model/ble_stations.js");
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
        ble_station.save(function(err){
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
  }}
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
    var ble_stationModel = require("../model/ble_stations.js");
    // check if bd_addr existed
    var Is_bd_addr_Existed = false;
    var query = ble_stationModel.findOne({ 'bd_addr': bd_addr });
    query.select('name');
    query.exec(function (err, ble_station) {
      if (err) return handleError(err);
      if(ble_station != null)
        Is_bd_addr_Existed = true;
      if(!Is_bd_addr_Existed){
        response = { status : "NG", message : "bd_addr is not existed" };
        res.json(response);
      }
      else{
        ble_stationModel.update(
          { bd_addr: bd_addr}, 
          { $set: { bd_addr: bd_addr, name: name, x: x, y: y }},
          function(err){
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
  }}
exports.delStation = function(req, res) {
  var response = { status: "OK", message:"" };//if proccess status would be "OK" or "NG"
  var IsWellFormat = true;
  const bd_addr = req.body.bd_addr;
  try{
  }
  catch(err){
    IsWellFormat = false;
    response = { status : "NG", message : err.message };
  }
  if(IsWellFormat) {
    var ble_stationModel = require("../model/ble_stations.js");
    ble_stationModel.remove({ bd_addr: bd_addr },
    function(err){
      if(err){
        response = { status : "NG", message : err };
      }
      res.json(response);
    });
  }
  else {
      res.json(response);
  }}
//users
exports.addUser = function(req, res){
}

//areas