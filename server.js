var five = require('johnny-five');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('Server listening on port: ' + port);
});

app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// johnny-five
var board = new five.Board();

board.on('ready', function() {
    var led = new five.Led(13);

    io.on('connection', function(socket) {

        socket.on('light:on', function() {
          on();
        });

        socket.on('light:off', function() {
          off();
        });

        function on() {
            socket.broadcast.emit('light:on');
            led.on();
        }

        function off() {
            socket.broadcast.emit('light:off');
            led.off();
        }

        board.repl.inject({
            on: on,
            off: off
        });
    });
});
