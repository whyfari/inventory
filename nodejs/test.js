var d = require('debug')('app');

console.log('console text');
console.log("\x1b[2m", "\x1b[5m", "\x1b[31m", "\x1b[44m", "Console Text+", "\x1b[0m");

d('debug text');
d("\x1b[2m", "\x1b[5m", "\x1b[31m", "\x1b[44m", "Debug text+", "\x1b[0m");