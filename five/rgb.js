var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {

    function Led(_port, _board) {
        var port = _port,
            board = _board,
            output;

        this.set = function(_output) {
            output = _output;
            board.analogWrite(port, output);
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
    var green = new Led(11, this);
    var red = new Led(10, this);
    var blue = new Led(9, this);

    this.repl.inject({
      red: red,
      green: green,
      blue: blue
    });
});
