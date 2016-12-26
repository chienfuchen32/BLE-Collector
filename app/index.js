var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
// var io = require('socket.io')(http);
var router_ble = require('../routers/ble.js');
var ble = require('../configs/ble.js');
var core = require('../app/core.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

//hide express header
app.disable('x-powered-by');

//allow CORS --> security of socket io can use things like this https://auth0.com/blog/auth-with-socket-io/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('env', 'dev');

app.get('/', function(req, res){
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});
app.use('/ble', router_ble);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send('404 Not Found')
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

//socket io
io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('hi');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
    io.emit('chat message', { for: 'everyone' });
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
