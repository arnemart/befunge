var Mm = function() {
    var methods = {};
    var lib = function() {
        var what = arguments[0],
            args = Array.prototype.slice.call(arguments, 1).concat([what]);
        if (methods[what]) {
            return methods[what].apply(null, args);
        } else {
            error('Method ' + what + ' is not defined');
        }
    };
    lib.when = function(what, callback) {
        if (what.forEach) {
            what.forEach(function(name) {
                methods[name] = callback;
            });
        } else {
            methods[what] = callback;
        }
        return lib;
    };
    return lib;
};

var step = Mm()
    .when(' ', function(env) {
        return env;
    })
    .when(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], function(env, num) {
        env.stack.push(parseInt(num, 10));
        return env;
    })
    .when('+', function(env) {
        env.stack.push(env.stack.pop() + env.stack.pop());
        return env;
    })
    .when('-', function(env) {
        var a = env.stack.pop(),
            b = env.stack.pop();
        env.stack.push(b - a);
        return env;
    })
    .when('*', function(env) {
        env.stack.push(env.stack.pop() * env.stack.pop());
        return env;
    })
    .when('/', function(env) {
        var a = env.stack.pop(),
            b = env.stack.pop();
        env.stack.push(Math.floor(b / a));
        return env;
    })
    .when('%', function(env) {
        var a = env.stack.pop(),
            b = env.stack.pop();
        env.stack.push(b % a);
        return env;
    })
    .when('!', function(env) {
        env.stack.push(env.stack.pop() === '0' ? '1' : '0');
        return env;
    })
    .when('`', function(env) {
        env.stack.push(env.stack.pop() < env.stack.pop() ? '1' : '0');
        return env;
    })
    .when(['>', 'v', '<', '^'], function(env, dir) {
        env.direction = dir;
        return env;
    })
    .when('?', function(env) {
        env.direction = ['>', 'v', '<', '^'][Math.floor(Math.random() * 4)];
        return env;
    })
    .when('_', function(env) {
        env.direction = (env.stack.pop() === 0 ? '>' : '<');
        return env;
    })
    .when('|', function(env) {
        env.direction = (env.stack.pop() === 0 ? 'v' : '^');
        return env;
    })
    .when(':', function(env) {
        var a = env.stack.pop();
        env.stack.push(a);
        env.stack.push(a);
        return env;
    })
    .when('\\', function(env) {
        var a = env.stack.pop(),
            b = env.stack.pop();
        env.stack.push(a);
        env.stack.push(b);
        return env;
    })
    .when('$', function(env) {
        env.stack.pop();
        return env;
    })
    .when('.', function(env) {
        env.output += env.stack.pop();
        output(env.output);
        return env;
    })
    .when(',', function(env) {
        env.output += String.fromCharCode(env.stack.pop());
        output(env.output);
        return env;
    })
    .when('&', function(env) {
        env.stack.push(parseInt(prompt('Please enter a number'), 10));
        return env;
    })
    .when('~', function(env) {
        env.stack.push(prompt('Please enter a character').charCodeAt(0));
        return env;
    })
    .when('"', function(env) {
        env.stringMode = true;
        return env;
    })
    .when('#', function(env) {
        env.next();
        return env;
    })
    .when('p', function(env) {
        var y = env.stack.pop(),
            x = env.stack.pop();
        if (env.program[y] && env.program[y][x]) {
            env.program[y][x] = String.fromCharCode(env.stack.pop());
            var lines = [];
            env.program.forEach(function(line) {
                lines.push(line.join(''));
            });
            setProgram(lines.join('\n'));
        } else {
            error('Trying to write outside program bounds');
        }
        return env;
    })
    .when('g', function(env) {
        var y = env.stack.pop(),
            x = env.stack.pop();
        if (env.program[y] && env.program[y][x]) {
            env.stack.push(env.program[y][x].charCodeAt(0));
        } else {
            error('Trying to read from outside program bounds');
        }
        return env;
    })
    .when('string', function(c, env) {
        if (c === '"') {
            env.stringMode = false;
        } else {
            env.stack.push(c.charCodeAt(0));
        }
        return env;
    })
    .when('@', function(env) {
        env.done = true;
        return env;
    })
    .when('l', function(env) {
        console.log(env.stack.join(', '));
        return env;
    });

var output = function(text) {
    document.getElementById('output').innerHTML = text;
    console.log(text);
};

var error = function(message) {
    alert('Error: ' + message);
};

var setProgram = function(program) {
    document.getElementById('input').innerHTML = program;
};

var loadAndRun = function() {
    var program = document.getElementById('input').value;
    localStorage.setItem('program', program);
    run(program);
};

prevProgram = localStorage.getItem('program');
if (prevProgram) {
    document.getElementById('input').innerHTML = prevProgram;
}

var loadProgram = function(which) {
    setProgram({
        'fizzbuzz': '0> 1+:3%v\n>^  v%5:_:5% v\n,v.:_v     v0_0"zzub"v\n"v         #\n     >0"zzub"v\n"   v"fizz"<         <\n^<         $<>:#,_v\n    >      #^^#   <',
        'upcase': '>0"ol"v\nv"hel"<\n>:  v\nv*48_@\n>-,:^',
        'hello': '>              v\nv"Hello world!"<\n> ,,,,,,,,,,,,@'
    }[which] || '');
};

document.getElementById('load').addEventListener('change', function() {
    loadProgram(this.value);
    this.value = "none";
});

var doIndeedStop = function() {};
var pleaseStop = function() {
    doIndeedStop();
};

document.getElementById('pleaseStop').addEventListener('click', pleaseStop);

document.getElementById('run').addEventListener('click', loadAndRun);

var run = function(program) {
    output('');
    var prog = [],
        longest = 0;
    program.split('\n').forEach(function(line) {
        var chars = [];
        if (line.length > longest) {
            longest = line.length;
        }
        line.split('').forEach(function(c) {
            chars.push(c);
        });
        prog.push(chars);
    });

    var env = {
        direction: '>',
        stack: [],
        stringMode: false,
        output: '',
        done: false,
        program: prog,
        height: prog.length,
        width: longest,
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
            if (this.program[this.y][this.x]) {
                return this.program[this.y][this.x];
            } else {
                return ' ';
            }
        }
    };

    doIndeedStop = function() {
        env.done = true;
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
};
