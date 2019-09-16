
module.exports = function ( namespace ) {

  var add = ''
  if ( namespace ) {
    add = namespace+':';
  }

  var debug = require('debug');
  
  var e = debug(add+'[ERROR]');                // error 
  var w = debug(add+'[WARNING]');              // warning
  var snh = debug(add+'[SNH]');                // should not happen 
  var td = debug(add+'[TODO_FA_]');            // TODO_FA_ 
  var why = debug(add+'[WHY]');                // but why 

  var l = debug(add+'log');                       // info level 1
  var l2 = debug(add+'l2');                    // info level 2
  var l3 = debug(add+'l3');                    // info level 3

  var init = debug(add+'init');                // init

  var f = debug(add+'func');                   // function
  var fb = debug(add+'beg');                   // function beginning
  var fe = debug(add+'end');                   // function end

  var http = debug(add+'http');                // http 1
  var http2 = debug(add+'http:2');             // http 2
  var httpr = debug(add+'http:res');           // http response
  
  var db = debug(add+'db');                    // db 1
  var db2 = debug(add+'db2');                  // db 2
  var db3 = debug(add+'db3');                  // db 3
  var dbm = debug(add+'db:method')             // db method


  return { debug, e, w, snh, td, why,
           l, l2, l3, init, f, fb, fe,
           http, http2, httpr, 
           db, db2, db3, dbm };

}