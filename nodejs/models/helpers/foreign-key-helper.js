var logNameSpace = 'H.FK';
var dlog = require('../../lib/debuggers')(logNameSpace);

const mongoose = require('mongoose');

module.exports = (fModelName, fFieldName, localFieldValue, shouldExist) => {

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
          return reject(new Error(
            '1 FK Constraint: foreign key look up failed for '+
            `'${localFieldValue.toString()}'`));
        }
      });
    } else {
    // removing an object which is a foreign key for an existing ojbect
      model.findOne({ [fFieldName]: localFieldValue }, (err, result) => {
        if ( !result ) {
          return resolve(true);
        }
        else {
          return reject(new Error(
            `1 FK Constraint: foreign key ' ${localFieldValue.toString()}'` +
            'is being referenced'));
        }
      });
    }
  });
}
