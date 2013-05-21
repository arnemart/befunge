var Befunge = require('./befunge');

var program = '>              v\n' +
              'v"Hello world!"<\n' +
              '> ,,,,,,,,,,,,@';

var setProgram = function() {};

var getInput = function(question) {
    // Do some stdin-stuff, I guess
};

var output = function(chr) {
    process.stdout.write(chr);
};

var error = function(message) {
    console.log('Error: ' + message);
};

var befunge = new Befunge(setProgram, getInput, output, error);

befunge.start(program);