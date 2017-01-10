var express = require('express');
var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router_ble = require('../routers/ble.js');
var router_ble_staion = require('../routers/ble_station.js');
var router_area = require('../routers/area.js');
var router_user = require('../routers/user.js');
var Core = require('../app/core.js');
var hardcore = new Core(2,2);
var globals = require('../globals/globals.js');
var config_mongodb = require('../configs/mongodb.js');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;//https://github.com/Automattic/mongoose/issues/4291
mongoose.connect(config_mongodb.mongodb.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));//因為遇到http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected 所以把這個關閉
db.on('open', function() {
  // console.log('connected');
  hardcore.bleStationsUpdate();
  hardcore.estimateStart();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

//hide express header
app.disable('x-powered-by');

//allow CORS? --> security of socket io can use things like this https://auth0.com/blog/auth-with-socket-io/
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/assets', express.static('assets'));

app.set('env', 'dev');

app.get('/', function(req, res){
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});
app.get('/station', function(req, res){
  res.sendFile(__dirname + '/station.html');
});
app.use('/ble', router_ble);
app.use('/station', router_ble_staion);
app.use('/area', router_area);
app.use('/user', router_user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send('404 Not Found');
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

let test = setInterval(function(){
  io.emit('ble_locator', globals.locations_bles);
  io.emit('ble_devices', globals.bles_native);
}, 5000);
// socket io
io.on('connection', function(socket){
  console.log('a user connected');
  // socket.broadcast.emit('hi');
  // socket.on('chat message', function(msg){
  //   // console.log('message: ' + msg);
  //   // io.emit('chat message', msg);
  //   // io.emit('chat message', { for: 'everyone' });
  // });

  socket.on('disconnect', function(){
    // console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
