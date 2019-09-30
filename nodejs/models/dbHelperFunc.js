var logNameSpace = 'H.FK';
var dlog = require('../lib/debuggers')(logNameSpace);
var cMess = require('../constants/messages.js');

const mongoose = require('mongoose');

let checkDbField = (rModelName, rFieldName, lFieldName, fieldValue, shouldExist, verboseMessage = true ) => {

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

module.exports = { checkDbField };
