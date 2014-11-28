var five = require('johnny-five');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

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
            led.on();
        });

        socket.on('light:off', function() {
            led.off();
        });

        function on() {
            socket.emit('light:on');
            led.on();
        }

        function off() {
            socket.emit('light:off');
            led.off();
        }

        board.repl.inject({
            on: on,
            off: off
        });
    });
});
