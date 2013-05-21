module.exports = function(input) {
    var lines = input.split('\n');
    var longestLine = lines.reduce(function(longest, current) {
        var currentLength = current.length;
        return (currentLength > longest ? currentLength : longest);
    }, 0);
    var pad = function(line) {
        return line + (new Array(longestLine - line.length + 1)).join(' ');
    };
    var prog = lines.reduce(function(prog, line) {
        prog.push(pad(line).split(''));
        return prog;
    }, []);
    return prog;
};