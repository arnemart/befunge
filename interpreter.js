var Mm = require('./Mm');

module.exports = function(setProgram, getInput, output, error) {
    return new Mm(error)
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
            env.stack.push(env.stack.pop() === 0 ? 1 : 0);
            return env;
        })
        .when('`', function(env) {
            env.stack.push(env.stack.pop() < env.stack.pop() ? 1 : 0);
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
            var chr = env.stack.pop();
            env.output += chr;
            output(chr, env.output);
            return env;
        })
        .when(',', function(env) {
            var chr = String.fromCharCode(env.stack.pop());
            env.output += chr;
            output(chr, env.output);
            return env;
        })
        .when('&', function(env) {
            env.stack.push(parseInt(getInput('Please enter a number'), 10));
            return env;
        })
        .when('~', function(env) {
            env.stack.push(getInput('Please enter a character').charCodeAt(0));
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
                setProgram(env.program.map(function(line) {
                    return line.join('');
                }).join('\n'));
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
};