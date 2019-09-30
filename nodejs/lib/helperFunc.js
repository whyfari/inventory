var cMess = require('../constants/messages.js');
var cDb= require('../constants/dbConsts');

let jsLen = ( obj ) => {
  return  Object.entries(obj).length
}
let jsIsEmpty = ( obj, len ) => {

  let isEmpty = false;

  if ( len == undefined ) {
    len = Object.entries(obj).length;
  }

  //FIXME
  // had copied the Object checking part from SOO ... my obj is an Array
  // will just check length for now
  //isEmpty = ( len == 0 && obj.constructor === Object);

  isEmpty =  ( len == 0 );

  return isEmpty;
}

let getErrorMessage = (err, cThis, type) => {
  let msg = '';

  if ( err.name == cDb.errors.eMongoError &&
        err.code == cDb.errors.eCodeDuplicate ) {
    msg = cMess.mText(cMess.mCode.ERR_DB_DUP, cThis.coll);
  } else if ( err.name == cDb.errors.eValidationError ) {
    msg = cMess.mText(cMess.mCode.ERR_DB_VALIDATION, cThis.coll);
  } else {
    msg = cMess.mText(cMess.mCode.CR_ERR, cThis.coll);
  }

  return msg;
}

module.exports = {
  jsIsEmpty: jsIsEmpty, jsLen, getErrorMessage,
}
