// init ngrok with server load
require('./initNgrok.js')();


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

    function Led(_color, _port, _board) {
        console.log('configuring led');
        var port = _port,
            board = _board,
            output;

        this.color = _color;

        this.set = function(_output) {
            output = _output;
            board.analogWrite(port, output);
        };

        this.get = function() {
            return output;
        };

        // helpers
        this.off = function() {
            this.set(0);
        };
        this.on = function() {
            this.set(255);
        };

        // init
        output = 0;
        this.pin = board.pinMode(port, five.Pin.PWM);
        this.set(output);

    }

    // ports = 11, 10, 9
    var colors = {
        green: new Led('green', 11, this),
        red: new Led('red', 10, this),
        blue: new Led('blue', 9, this)
    };


    // remember connections
    var connections = 0;

    io.on('connection', function(socket) {
        connections++;
        console.log('connected: ' + connections);

        // when a client changes the light setting
        socket.on('set', function(data) {
            colors[data.color].set(data.output);
            socket.broadcast.emit('set', data);
        });

        // when the client needs to initialize
        socket.on('init', function() {
            // iterate over colors
            for (var key in colors) {
                var color = colors[key];
                // send back info for each light
                // TODO: concat into one message back
                socket.emit('set', {
                    color: color.color,
                    output: color.get()
                });
            }
        });

        socket.on('disconnect', function() {
            connections--;
            console.log('disconnected');
            console.log('connected: ' + connections);
        });

        board.repl.inject(colors);
    });
});
