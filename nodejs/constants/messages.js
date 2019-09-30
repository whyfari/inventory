let logNameSpace = 'messages';
var dlog = require('../lib/debuggers')(logNameSpace);
var cDb = require('./dbConsts');

const mCode = {

// 1-20    high-level
// 20 - 60  data-base
// 60 - 100

  SERVER_START:                    1,
  DB_CONN_SUCC:                    2,
  DB_CONN_FAIL:                    3,
  ROOT_ROUTE:                      4,

  READ_SUCC :                      20,
  READ_FAIL :                      21,
  READ_ERR:                        22,
  READ_NONE:                       23,

  DEL_SUCC :                       24,
  DEL_FAIL :                       25,
  DEL_ERR:                         26,
  CR_SUCC :                        27,
  CR_FAIL:                         28,
  CR_ERR:                          29,
  ERR_DB_DUP:                      30,
  ERR_DB_VALIDATE:                 31,
  ERR_FK_DNE:                      32,
  ERR_FK_REF_EXISTS:               33,

  CMP_PASS_ERR:                    61,
  CRED_FAIL:                       62,
  CRED_SUCC:                       63,
  ERR_REQ_VALIDATION:              64,
  ERR_FIELD_REQUIRED:              65,
  ERR_FIELD_INVALID:               66,
  ERR_FIELD_NOT_ID:                67,
}

module.exports = mCode;

var mText = function ( messageCode) {

  var mes = '';
  switch(messageCode) {

    case mCode.SERVER_START:
      mes = 'Server started at port: \'' + arguments[1] + '\'';
      break;

    case mCode.DB_CONN_SUCC:
      mes = 'Database connection succeeded on \'' + arguments[1] + '\'';
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

    case mCode.READ_NONE:
      mes = 'Found no matching record(s) on table \'' + arguments[1] + '\'';
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

    case mCode.ERR_DB_DUP:
      mes = 'Duplicate record error on  table \'' + arguments[1] + '\'';
      break;

    case mCode.ER_DB_VALIDATE:
      mes = 'Got a \'' + cDb.errors.eValidationError + '\' error on table \'' +
        arguments[1] + '\'';
      break;

    case mCode.CMP_PASS_ERR:
      mes = 'Bcrypt password compare error: \'' + arguments[1] + '\'';
      break;

    case mCode.CRED_FAIL:
      mes = 'Incorrect \'' + arguments[1] + '\'';
      break;

    case mCode.CRED_SUCC:
      mes = 'Correct credentials'
      break;

    case mCode.ERR_REQ_VALIDATION:
      mes = 'Errors while validation req body: ' + '\'' + arguments[1] + '\'';
      break;

    case mCode.ERR_FIELD_REQUIRED:
      mes = '\'' + arguments[1] + '\' is required';
      break;

    case mCode.ERR_FIELD_INVALID:
      mes = '\'' + arguments[1] + '\' is invalid or missing';
      break;

    case mCode.ERR_FK_DNE:
      mes = 'Foreign key look up failed for field  \'' + arguments[1] +
        '\' : \'' + arguments[2] + '\' on table \'' + arguments[3] + '\'';
      break;

    case mCode.ERR_FK_REF_EXISTS:
      mes = 'Foreign key \'' + arguments[1] + '\' : \'' + arguments[2] +
        '\' on table \'' + arguments[3] + '\' is being referenced somewhere';
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