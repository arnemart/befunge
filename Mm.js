module.exports = function(error) {
    var methods = {};
    if (!error) {
        error = console.log;
    }
    var mm = function() {
        var what = arguments[0],
            args = Array.prototype.slice.call(arguments, 1).concat([what]);
        if (methods[what]) {
            return methods[what].apply(null, args);
        } else {
            error('No method registered for "' + what + '"');
        }
    };
    var addMethod = function(name, whatDo) {
        if (typeof whatDo === 'function') {
            methods[name] = whatDo;
        } else {
            methods[name] = function() {
                return whatDo;
            };
        }
    };
    mm.when = function(what, whatDo) {
        if (what.forEach) {
            what.forEach(function(name) {
                addMethod(name, whatDo);
            });
        } else {
            addMethod(what, whatDo);
        }
        return mm;
    };
    return mm;
};
