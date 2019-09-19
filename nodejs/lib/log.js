//var logNameSpace = 'log';
//var dlog = require('../lib/debuggers')(logNameSpace);

module.exports.js= function (obj) {
  return (JSON.stringify(obj,null,2));
}