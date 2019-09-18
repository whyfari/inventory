var logNameSpace = 'H.FK';
var dlog = require('../../lib/debuggers')(logNameSpace);

const mongoose = require('mongoose');

module.exports = (fCollectionName, fFieldName, localValue, shouldExist) => {

    dlog.fb('ForeignKey');
    var model = mongoose.model(fCollectionName);
	return new Promise((resolve, reject) => {

		// trying to add an object for which the foreign key DNE
		if ( shouldExist ) {
				model.findOne({ [fFieldName]: localValue }, (err, result) => {
					if ( result ) {
						return resolve(true);
					}
					else {
										return reject(new Error(
										`1 FK Constraint 'checkObjectsExists' for '${localValue.toString()}' failed`));
					}
				});
		} else {
		// removing an object which is a foreign key for an existing ojbect
				model.findOne({ [fFieldName]: localValue }, (err, result) => {
					if ( !result ) {
						return resolve(true);
					}
					else {
										return reject(new Error(
										`2 FK Constraint 'checkObjectsExists' for '${localValue.toString()}' failed`));
					}
				});
		}
  });
}
