var validator = require('validator');
//response -> status would be 'OK' or 'NG'
var globals = require('../globals/globals.js');
function datetime_check(str_date1,str_date2){
  var date1 = new Date(str_date1);
  var date2 = new Date(str_date2);
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffMinutes = Math.ceil(timeDiff / (1000 * 3600 * 24 * 60));
  return(diffMinutes);}
function compare_rssi(a, b){
  //http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
  if (a.rssi < b.rssi)
    return -1;
  if (a.rssi > b.rssi)
    return 1;
  return 0;}
exports.handle_peripheral = function(req, res) {//handle ble info staion sniffed then update globals/globals.bles
  //****please lock globals.bles_native https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
  try{
    var response = { status: 'OK', message: '' };
    var IsWellFormat = true;
    //get http parameter to update ble
    let ble_list = req.body.ble_list;
    //****try make ble.exe send rssi int16 message
    for(let i  = 0; i < ble_list.length; i++){
      let Is_ble_Existed = false;
      let s_bd_addr = req.body.s_bd_addr;
      let ble = {
        addr_type: ble_list[i].addr_type,
        bd_addr: ble_list[i].bd_addr,
        type: ble_list[i].type,
        company: ble_list[i].company,
        name: ble_list[i].name,
        tx_power: ble_list[i].tx_power,
        rssi: ble_list[i].rssi,
        datetime: ble_list[i].datetime,
      }
      for(let j = 0; j < globals.bles_native.length; j++){
        if(globals.bles_native[j].s_bd_addr == s_bd_addr){
          for(let k = 0; k < globals.bles_native[j].bles.length; k++){
            if(globals.bles_native[j].bles[k].bd_addr == ble_list[i].bd_addr){
              globals.bles_native[j].bles[k].tx_power = ble_list[i].tx_power;
              globals.bles_native[j].bles[k].rssi = ble_list[i].rssi;
              globals.bles_native[j].bles[k].datetime = ble_list[i].datetime;
              Is_ble_Existed = true;
            }
          }
        }
      }
      if(!Is_ble_Existed){
        let Is_ble_station_Existed = false;
        for(let j = 0; j < globals.bles_native.length; j++){
          if(globals.bles_native[j].s_bd_addr == s_bd_addr){
            globals.bles_native[j].bles[globals.bles_native[j].bles.length] = ble;
            Is_ble_station_Existed = true;
          }
        }
        if(!Is_ble_station_Existed){
          globals.bles_native[globals.bles_native.length] = {
            s_bd_addr: s_bd_addr,
            bles: [ ble ]
          }
        }
      }
    }
    // console.log(globals.bles_native)
    //****please lock globals.bles 
    for(let j = 0; j < globals.bles_native.length; j++){
      for(let k = 0; k < globals.bles_native[j].bles.length; k++){
        let Is_ble_Existed = false;
        let ble = {
          bd_addr: ''
        }
        for(let h = 0; h < globals.bles.length; h++){
          if(globals.bles[h].bd_addr == globals.bles_native[j].bles[k].bd_addr){
            let Is_ble_station_Existed = false;
            for(let i = 0; i < globals.bles[h].ble_stations.length; i++){
              if(globals.bles[h].ble_stations[i].s_bd_addr == globals.bles_native[j].s_bd_addr){
                globals.bles[h].ble_stations[i].rssi = globals.bles_native[j].bles[k].rssi;
                globals.bles[h].ble_stations[i].datetime = globals.bles_native[j].bles[k].datetime;
                Is_ble_station_Existed = true;
              }
            }
            if(!Is_ble_station_Existed){
              globals.bles[h].ble_stations = [{
                s_bd_addr: globals.bles_native[j].s_bd_addr,
                rssi: globals.bles_native[j].bles[k].rssi,
                datetime: globals.bles_native[j].bles[k].datetime
              }];
            }
            Is_ble_Existed = true;
          }
        }
        if(!Is_ble_Existed){
          globals.bles[globals.bles.length]={
            addr_type: globals.bles_native[j].bles[k].addr_type,
            bd_addr: globals.bles_native[j].bles[k].bd_addr,
            type: globals.bles_native[j].bles[k].type,
            company: globals.bles_native[j].bles[k].company,
            name: globals.bles_native[j].bles[k].name,
            ble_stations : [{
              s_bd_addr: globals.bles_native[j].s_bd_addr,
              tx_power: globals.bles_native[j].bles[k].tx_power,
              rssi: globals.bles_native[j].bles[k].rssi,
              datetime: globals.bles_native[j].bles[k].datetime
            }]
          }
        }
      }
    }
    //****delete globals.bles_native where (globals.bles_native.bles[i].datetime).substract(Date.now()) > 1 minute
    for(let i = 0; i < globals.bles_native.length; i++){
      globals.bles_native[i].bles.sort(compare_rssi);
    }
    console.log('ble device number: ' + globals.bles.length);
    res.json(response);
  }
  catch(err){
    console.err('info_collector err: ' + err);
  }}
//ble station
exports.findStation = function(req, res){
  var response = { status: 'OK', message: '' };
  try{
  var ble_stationModel = require('../model/ble_stations.js');
  ble_stationModel.find({}, function (err, ble_stations) {
    if (err){
      response = { status : 'NG', message : err };
    }
    else{
      response.message = ble_stations;
    }
    res.json(response);
  })
  }
  catch(err){
    response = { status : 'NG', message : err };
    res.json(response);
  }}
exports.addStation = function(req, res) {
  var response = { status: 'OK', message: '' };
  var IsWellFormat = true;
  const bd_addr = req.body.bd_addr;
  const name = req.body.name;
  const x = req.body.x;
  const y = req.body.y;
  try{
    if((typeof x != 'undefined') && (!validator.isInt(x))){
      throw 'x format wrong';
    }
    if((typeof y != 'undefined') && (!validator.isInt(y))){
      throw 'y format wrong';
    }
  }
  catch(err){
    IsWellFormat = false;
    response = { status : 'NG', message : err.message };
  }
  if(IsWellFormat) {
    var ble_stationModel = require('../model/ble_stations.js');
    // check if bd_addr existed
    var Is_bd_addr_Existed = false;
    var query = ble_stationModel.findOne({ bd_addr: bd_addr });
    query.select('name');
    query.exec(function (err, ble_station) {
      if (err) return handleError(err);
      if(ble_station != null)
        Is_bd_addr_Existed = true;
      if(Is_bd_addr_Existed){
        response = { status : 'NG', message : 'bd_addr is already existed' };
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
            response = { status : 'NG', message : err };
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
  var response = { status: 'OK', message: '' };
  var IsWellFormat = true;
  const bd_addr = req.body.bd_addr;
  const name = req.body.name;
  const x = req.body.x;
  const y = req.body.y;
  try{
    if((typeof x != 'undefined') && (!validator.isInt(x))){
      throw 'x format wrong';
    }
    if((typeof y != 'undefined') && (!validator.isInt(y))){
      throw 'y format wrong';
    }
  }
  catch(err){
    IsWellFormat = false;
    response = { status : 'NG', message : err.message };
  }
  if(IsWellFormat) {
    var ble_stationModel = require('../model/ble_stations.js');
    // check if bd_addr existed
    var Is_bd_addr_Existed = false;
    var query = ble_stationModel.findOne({ bd_addr: bd_addr });
    query.select('name');
    query.exec(function (err, ble_station) {
      if (err) return handleError(err);
      if(ble_station != null)
        Is_bd_addr_Existed = true;
      if(!Is_bd_addr_Existed){
        response = { status : 'NG', message : 'bd_addr is not existed' };
        res.json(response);
      }
      else{
        ble_stationModel.update(
          { bd_addr: bd_addr}, 
          { $set: { name: name, x: x, y: y }},
          function(err){
            if(err){
              response = { status : 'NG', message : err };
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
  var response = { status: 'OK', message: '' };
  var IsWellFormat = true;
  const bd_addr = req.body.bd_addr;
  try{
  }
  catch(err){
    IsWellFormat = false;
    response = { status : 'NG', message : err.message };
  }
  if(IsWellFormat) {
    var ble_stationModel = require('../model/ble_stations.js');
    ble_stationModel.remove({ bd_addr: bd_addr },
    function(err){
      if(err){
        response = { status : 'NG', message : err };
      }
      res.json(response);
    });
  }
  else {
      res.json(response);
  }}
/*//users
exports.addUser = function(req, res){
  var response = { status: 'OK', message: '' };
  var IsWellFormat = true;
  const name = req.body.name;
  const gender = req.body.gender;
  const id = req.body.id;
  const password = req.body.password;
  const email = req.body.email;
  const phone_type = req.body.phone_type;
  const country_code = req.body.country_code;
  const number = req.body.number;
  const photo_path = req.body.photo_path;
  const ble_devices = req.body.ble_devices;
  try{
    const pass_regex = /^[a-zA-Z0-9]+$/;
    if(((typeof id != 'undefined') && (!pass_regex.test(id))) || (id == '')){
      throw 'id format wrong';
    }
    if(((typeof password != 'undefined') && (!pass_regex.test(password))) || (password == '')){
      throw 'password format wrong';
    }
    if((typeof gender != 'undefined') && ((!validator.isInt(gender)) || ((gender != 0) && (gender != 1) && (gender != 2) && (gender != 9)))){
      throw 'gender format wrong';
    }
    if((typeof email != 'undefined') && (!validator.isEmail(email))){
      throw 'email format wrong';
    }
    if((typeof country_code != 'undefined') && (!validator.isInt(country_code))){
      throw 'country code format wrong';
    }
    if((typeof number != 'undefined') && (!validator.isInt(number))){
      throw 'number format wrong';
    }
  }
  catch(err){
    IsWellFormat = false;
    response = { status : 'NG', message : err.message };
  }
  if(IsWellFormat) {
    var usermodel = require('../model/user.js');
    // check if id existed 
    var IsIdExisted = false;
    var query = usermodel.findOne({ id: id });
    query.select('name');
    query.exec(function (err, user) {
      if (err) return handleError(err);
      if(user != null)
        IsIdExisted = true;
      if(IsIdExisted){
        response = { status : 'NG', message : 'id is already existed' };//人工unique key
        res.json(response);
      }
      else{
        var user = new usermodel({
          name: name, 
          gender: gender, 
          id: id, 
          password: password, 
          email: email, 
          contact: { phone: [{ phone_type: phone_type, country_code: country_code, number: number }]}, 
          photo_path: photo_path, 
          ble_devices: [ ble_devices ], 
          create_datetime: Date.now(), 
          update_datetime: Date.now()
        });
        user.save(function(err){
          if(err){
            response = { status : 'NG', message : err };
          }
          res.json(response);
        });
      }
    })
  }
  else {
      res.json(response);
  }}
exports.editUser = function(req, res) {
  var response = { status: 'OK', message: '' };
  var IsWellFormat = true;
  const name = req.body.name;
  const gender = req.body.gender;
  const id = req.body.id;
  const password = req.body.password;
  const email = req.body.email;
  const phone_type = req.body.phone_type;
  const country_code = req.body.country_code;
  const number = req.body.number;
  const photo_path = req.body.photo_path;
  const ble_devices = req.body.ble_devices;
  try{
    const pass_regex = /^[a-zA-Z0-9]+$/;
    if(((typeof id != 'undefined') && (!pass_regex.test(id))) || (id == '')){
      throw 'id format wrong';
    }
    if(((typeof password != 'undefined') && (!pass_regex.test(password))) || (password == '')){
      throw 'password format wrong';
    }
    if((typeof gender != 'undefined') && ((!validator.isInt(gender)) || ((gender != 0) && (gender != 1) && (gender != 2) && (gender != 9)))){
      throw 'gender format wrong';
    }
    if((typeof email != 'undefined') && (!validator.isEmail(email))){
      throw 'email format wrong';
    }
    if((typeof country_code != 'undefined') && (!validator.isInt(country_code))){
      throw 'country code format wrong';
    }
    if((typeof number != 'undefined') && (!validator.isInt(number))){
      throw 'number format wrong';
    }
  }
  catch(err){
    IsWellFormat = false;
    response = { status : 'NG', message : err.message };
  }
  if(IsWellFormat) {
    var userModel = require('../model/user.js');
    // check if bd_addr existed
    var Is_id_Existed = false;
    var query = userModel.findOne({ id : id });
    query.select('name');
    query.exec(function (err, user) {
      if (err) return handleError(err);
      if(user != null)
        Is_id_Existed = true;
      if(!Is_id_Existed){
        response = { status : 'NG', message : 'id is not existed' };
        res.json(response);
      }
      else{
        userModel.update(
          { id: id}, 
          { $set: { name: name, 
                    gender: gender, 
                    password: password, 
                    email: email, 
                    contact: { phone: [{ phone_type: phone_type, country_code: country_code, number: number }]}, 
                    photo_path: photo_path, 
                    ble_devices: [ ble_devices ], 
                    create_datetime: Date.now(), 
                    update_datetime: Date.now()
          }},
          function(err){
            if(err){
              response = { status : 'NG', message : err };
            }
            res.json(response);
          });
      }
    })
  }
  else {
      res.json(response);
  }}
exports.delUser = function(req, res) {
  var response = { status: 'OK', message: '' };
  var IsWellFormat = true;
  const id = req.body.id;
  try{
    const pass_regex = /^[a-zA-Z0-9]+$/;
    if(((typeof id != 'undefined') && (!pass_regex.test(id))) || (id == '')){
      throw 'id format wrong';
    }
  }
  catch(err){
    IsWellFormat = false;
    response = { status : 'NG', message : err.message };
  }
  if(IsWellFormat) {
    var userModel = require('../model/user.js');
    userModel.remove({ id: id },
    function(err){
      if(err){
        response = { status : 'NG', message : err };
      }
      res.json(response);
    });
  }
  else {
      res.json(response);
  }}
*/
//areas
exports.editArea = function(req, res){
  var response = { status: 'OK', message: '' };
  var IsWellFormat = true;
  const width = req.body.width;
  const height = req.body.height;
  const meters_unit = req.body.meters_unit;
  try{
    if((typeof x != 'undefined') && (!validator.isInt(width))){
      throw 'width format wrong';
    }
    if((typeof y != 'undefined') && (!validator.isInt(height))){
      throw 'height format wrong';
    }
    if((typeof y != 'undefined') && (!validator.isInt(meters_unit))){
      throw 'meters_unit format wrong';
    }
  }
  catch(err){
    IsWellFormat = false;
    response = { status : 'NG', message : err.message };
  }
  if(IsWellFormat) {
    var areaModel = require('../model/areas.js');
    // check if bd_addr existed
    var Is_bd_addr_Existed = false;
    mongoose.connection.db.dropCollection('areas', function(err, result) {//http://stackoverflow.com/questions/11453617/mongoose-js-remove-collection-or-db
      if(err){
        response = { status : 'NG', message : err };
        res.json(response);
      }
      else{
        //insert data to mongodb
        var area = new areaModel({
            width: width,
            height: height,
            meters_unit: meters_unit
        });
        area.save(function(err){
          if(err){
            response = { status : 'NG', message : err };
          }
          res.json(response);
        });
      }
      
    });
  }
  else {
      res.json(response);
  }}
//ble_watch_list
exports.findBleWatchList = function(req, res){
  var response = { status: 'OK', message: '' };
  try{
    var ble_watch_listModel = require('../model/ble_watch_list.js');
    ble_watch_listModel.find({}, function (err, ble_watch_lists) {
      if (err){
        response = { status : 'NG', message : err };
      }
      else{
        response.message = ble_watch_lists;
      }
      res.json(response);
    })
  }
  catch(err){
    response = { status : 'NG', message : err };
    res.json(response);
  }}
exports.updateBleWatchList = function(req, res) {
  var response = { status: 'OK', message: '' };
  var IsWellFormat = true;
  const bd_addr = req.body.bd_addr;
  const addr_type = req.body.addr_type;
  const type = req.body.type;
  const company = req.body.company;
  const name = req.body.name;
  const user_name = req.body.user_name;
  if(IsWellFormat) {
    var ble_watch_listModel = require('../model/ble_watch_list.js');
    if(user_name == ''){//delete     
      ble_watch_listModel.remove({ bd_addr: bd_addr },
      function(err){
        if(err){
          response = { status : 'NG', message : err };
        }
        res.json(response);
      });
    }
    else{//save or update
      // check if bd_addr existed
      var Is_bd_addr_Existed = false;
      var query = ble_watch_listModel.findOne({ bd_addr: bd_addr });
      query.select('name');
      query.exec(function (err, ble_watch_list) {
        if (err) return handleError(err);
        if(ble_watch_list != null)
          Is_bd_addr_Existed = true;
        if(Is_bd_addr_Existed){
          ble_watch_listModel.update(
            { bd_addr: bd_addr}, 
            { $set: { addr_type: addr_type, type: type, company: company, name: name, user_name: user_name}},
            function(err){
              if(err){
                response = { status : 'NG', message : err };
              }
              res.json(response);
            });
        }
        else{//insert data to mongodb
          var ble_watch_list = new ble_watch_listModel(
            { bd_addr: bd_addr, addr_type: addr_type, type: type, company: company, name: name, user_name: user_name}
            );
          ble_watch_list.save(function(err){
            if(err){
              response = { status : 'NG', message : err };
            }
            res.json(response);
          });
        }
      })
    }
  }
  else {
      res.json(response);
  }}
