var logNameSpace = 'DbHelper';
var dlog = require('../lib/debuggers')(logNameSpace);
var cMess = require('../constants/messages');
var consts= require('../constants/consts');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


let compHash = (candidateField, hash, callback) => {
  //REMOVE remove this log ofc
  dlog.dbm('candidate field: ' + candidateField+ ' == hashed?: ' + hash);
  bcrypt.compare(candidateField, hash, (err, isMatch) => {
    if (err) {
      callback(err,null);
    } else {
      callback(null,isMatch);
    }
  });
}


let getHash = (pass , callback )  => {
  dlog.fu('getHash for', pass);

  bcrypt.genSalt ( consts.saltFactor, ( err, salt )  => {
    if ( err ) {
          dlog.e('salty salty' , err);
          callback(err);
    } else {
      bcrypt.hash(pass, salt, (err, hash) => {
        if (err) {
          dlog.e('Error while hashing : ' + err);
          callback(err)
        } else {
          dlog.l3('hashed field:' , hash);
          callback(null, hash);
        }
      });
    }
  });
}

let checkDbField = (rModelName, rFieldName, lFieldName,
                    fieldValue, shouldExist, verboseMessage = true ) => {

	dlog.fb('checkField: model:' , rModelName, 'rField: ', rFieldName, 'lField', lFieldName, ' value: ', fieldValue, ' exist?: ', shouldExist );

	var model = mongoose.model(rModelName);

	return new Promise((resolve, reject) => {

    model.findOne({ [rFieldName]: fieldValue }, (err, result) => {
      if ( shouldExist && result || !shouldExist && !result ) {
        return resolve(true);
      } else {
        if ( shouldExist ) {
          let msg = cMess.mText(cMess.mCode.ERR_FIELD_VALUE_DNE,
                                rFieldName,
                                lFieldName,
                                fieldValue,
                                rModelName,
                                verboseMessage);
          return reject(new Error(msg));

        } else {
          let msg = cMess.mText(cMess.mCode.ERR_FIELD_VALUE_EXISTS,
                                rFieldName,
                                lFieldName,
                                fieldValue,
                                rModelName,
                                verboseMessage);
          return reject(new Error(msg));
        }
      }

        if ( result ) {
        }
        else {
        }
    });
  })
}


module.exports = { getHash, compHash, checkDbField };
