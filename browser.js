var Befunge = require('./befunge');

var inputElement = document.getElementById('input');
var outputElement = document.getElementById('output');

var setProgram = function(program) {
    inputElement.innerHTML = program;
};

var output = function(chr, text) {
    outputElement.innerHTML = text;
};

var error = function(message) {
    alert('Error: ' + message);
};

var prevProgram = localStorage.getItem('program');
if (prevProgram) {
    setProgram(prevProgram);
}

var befunge = new Befunge(setProgram, prompt, output, error);

var loadAndRun = function() {
    var program = document.getElementById('input').value;
    localStorage.setItem('program', program);
    befunge.start(inputElement.value);
};

var loadProgram = function(which) {
    setProgram({
        'fizzbuzz': '0> 1+:3%v\n>^  v%5:_:5% v\n,v.:_v     v0_0"zzub"v\n"v         #\n     >0"zzub"v\n"   v"fizz"<         <\n^<         $<>:#,_v\n    >      #^^#   <',
        'upcase': '>0           v\nv"helloworld"<\n>:  v\nv*48_@\n>-,:^',
        'hello': '>              v\nv"Hello world!"<\n> ,,,,,,,,,,,,@'
    }[which] || '');
};

document.getElementById('load').addEventListener('change', function() {
    loadProgram(this.value);
    this.value = "none";
});
document.getElementById('pleaseStop').addEventListener('click', befunge.stop);
document.getElementById('run').addEventListener('click', loadAndRun);