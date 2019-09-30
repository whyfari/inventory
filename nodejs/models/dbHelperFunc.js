var logNameSpace = 'H.FK';
var dlog = require('../lib/debuggers')(logNameSpace);
var cMess = require('../constants/messages.js');

const mongoose = require('mongoose');

let fkCheck = (fModelName, fFieldName, localFieldValue, shouldExist) => {

	dlog.fb('ForeignKey: model:' ,fModelName, 'ffield: ', fFieldName, ' local: ', localFieldValue, ' exist?: ', shouldExist );

	var model = mongoose.model(fModelName);

	return new Promise((resolve, reject) => {

    // trying to add an object for which the foreign key DNE
    if ( shouldExist ) {
      model.findOne({ [fFieldName]: localFieldValue }, (err, result) => {
        if ( result ) {
          return resolve(true);
        }
        else {
          dlog.f('why',cMess.mCode.ERR_FK_DNE)
          let msg = cMess.mText(cMess.mCode.ERR_FK_DNE,
                                fFieldName,
                                localFieldValue,
                                fModelName);
          return reject(new Error(msg));
        }
      });
    } else {
    // removing an object which is a foreign key for an existing object
      model.findOne({ [fFieldName]: localFieldValue }, (err, result) => {
        if ( !result ) {
          return resolve(true);
        }
        else {
          let msg = cMess.mText(cMess.mCode.ERR_FK_REF_EXISTS,
                                fFieldName,
                                localFieldValue,
                                fModelName);
          return reject(new Error(msg));
        }
      });
    }
  });
}

module.exports = { fkCheck };
