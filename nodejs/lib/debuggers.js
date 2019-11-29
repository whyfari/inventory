
module.exports = function ( namespace ) {

  var add = ''
  if ( namespace ) {
    add = namespace+':';
  }

  var debug = require('debug');

  var f = debug(add+'[FARI]');                 // FARI
  var e = debug(add+'[ERROR]');                // error
  var w = debug(add+'[WARN]');                 // warning
  var snh = debug(add+'[SNH]');                // SNH
  var td = debug(add+'[TODO_FA_]');            // TODO_FA_
  var why = debug(add+'[WHY]');                // WHY

  var init = debug(add+'INIT');                // init

  var l = debug(add+'LOG');                    // INFO level 1
  var l2 = debug(add+'l2');                    // INFO level 2
  var l3 = debug(add+'L3');                    // INFO level 3


  var fu = debug(add+'FUNC');                  // function
  var fb = debug(add+'BEG');                   // function beg
  var fe = debug(add+'END');                   // function end

  var http = debug(add+'HTTP');                // http 1
  var http2 = debug(add+'HTTP:2');             // http 2
  var httpr = debug(add+'HTTP:RES');           // HTTP RESPONSE

  var db = debug(add+'DB');                    // db 1
  var db2 = debug(add+'DB2');                  // DB 2
  var db3 = debug(add+'DB3');                  // DB 3
  var dbm = debug(add+'DB:METHOD')             // db method


  return { debug, f, e, w, snh, td, why, init,
            l, l2, l3, fu, fb, fe,
            http, http2, httpr,
            db, db2, db3, dbm };

}