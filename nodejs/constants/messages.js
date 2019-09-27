let logNameSpace = 'messages';
var dlog = require('../lib/debuggers')(logNameSpace);

const mCode = {

// 1-20    high-level
// 20 - 60  data-base
// 60 - 100

  SERVER_START:            1,
  DB_CONN_SUCC:            2,
  DB_CONN_FAIL:            3,
  ROOT_ROUTE:              4,

  READ_SUCC :              20,
  READ_FAIL :              21,
  READ_ERR:                22,
  DEL_SUCC :               24,
  DEL_FAIL :               25,
  DEL_ERR:                 26,
  CR_SUCC :                27,
  CR_FAIL:                 28,
  CR_ERR:                  29,

  CMP_PASS_ERR:            61,
  CRED_FAIL:               62,
  CRED_SUCC:               63,
}

module.exports = mCode;

var mText = function ( messageCode) {

  var mes = '';
  switch(messageCode) {

    case mCode.SERVER_START:
      mes = 'Server started at port: \'' + arguments[1] + '\'';
      break;

    case mCode.DB_CONN_SUCC:
      mes = 'Database connection succecceded';
      break;

    case mCode.DB_CONN_FAIL:
      mes = 'Database connection failed, error: \'' + arguments[1] + '\'';
      break;

    case mCode.READ_SUCC:
      mes = 'Found record(s) on table \'' + arguments[1] + '\'';
      if ( arguments[2] != undefined ) {
        mes += ' criteria: \'' + arguments[2] + '\'';
      }
      break;

    case mCode.READ_FAIL:
      mes = 'Failed to find record(s) on table \'' + arguments[1] + '\'';
      if ( arguments[2] != undefined ) {
        mes += ' criteria: \'' + arguments[2] + '\'';
      }
      break;

    case mCode.CR_SUCC:
      mes = 'Record added on table \'' + arguments[1] + '\'';
      break;

    case mCode.CR_FAIL:
      mes = 'Failed to add record on table \'' + arguments[1] + '\'';
      break;

    case mCode.CR_ERR:
      mes = 'Error while adding record on table \'' + arguments[1] + '\'';
      break;

    case mCode.CMP_PASS_ERR:
      mes = 'Bcrypt password compare error\'' + arguments[1] + '\'';
      break;

    case mCode.CRED_FAIL:
      mes = 'Incorrect \'' + arguments[1] + '\'';
      break;

    case mCode.CRED_SUCC:
      mes = 'Correct credentials'
      break;

    default:
      dlog.snh('Default message being printed');
      mes = 'Default message';
  }

  return mes;
}

module.exports = {
  mCode, mText
}