var five = require('johnny-five');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 3333;

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
    console.log('board is ready');

    var led = new five.Led(13);

    // remember light state
    var light = false;
    // remember connections
    var connections = 0;

    io.on('connection', function(socket) {
        connections++;
        console.log('connected: ' + connections);

        // set to what the light currently is
        socket.emit('light:' + (light ? 'on' : 'off'));

        socket.on('light:on', function() {
            on();
        });

        socket.on('light:off', function() {
            off();
        });

        socket.on('disconnect', function() {
            connections--;
            console.log('disconnected');
            console.log('connected: ' + connections);
        });

        function on() {
            io.emit('light:on');
            led.on();
            light = true;
        }

        function off() {
            io.emit('light:off');
            led.off();
            light = false;
        }

        board.repl.inject({
            on: on,
            off: off
        });
    });
});
