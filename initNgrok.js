module.exports = function() {
        var spawn = require('child_process').spawn;

        var ngrok = spawn('ngrok', ['start', 'hack']);

        ngrok.stdout.on('data', function (data) {
          //console.log('stdout: ' + data);
        });

        ngrok.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
        });

        ngrok.on('close', function (code) {
          console.log('child process exited with code ' + code);
        });
};
