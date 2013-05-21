var parse = require('./parser');
var Interpreter = require('./interpreter');

module.exports = function(getProgram, setProgram, getInput, output, error) {
    var step = new Interpreter(setProgram, getInput, output, error);
    var env = {};

    var befunge = {
        start: function() {
            var prog = parse(getProgram());
            env = {
                direction: '>',
                stack: [],
                stringMode: false,
                output: '',
                done: false,
                program: prog,
                height: prog.length,
                width: prog[0].length,
                x: -1,
                y: 0,
                next: function() {
                    var delta = {
                        '>': [1, 0],
                        'v': [0, 1],
                        '<': [-1, 0],
                        '^': [0, -1]
                    };
                    this.x = (this.x + delta[this.direction][0]) % this.width;
                    this.y = (this.y + delta[this.direction][1]) % this.height;
                    if (this.x < 0) {
                        this.x = this.width - 1;
                    }
                    if (this.y < 0) {
                        this.y = this.height - 1;
                    }
                    return this.program[this.y][this.x];
                }
            };
            var doStuff = function(env) {
                if (env.done) {
                    return;
                } else if (env.stringMode) {
                    setTimeout(function() {
                        doStuff(step('string', env.next(), env));
                    }, 0);
                } else {
                    setTimeout(function() {
                        doStuff(step(env.next(), env));
                    }, 0);
                }
            };

            doStuff(env);
        },
        stop: function() {
            env.done = true;
        }
    };
    return befunge;
};