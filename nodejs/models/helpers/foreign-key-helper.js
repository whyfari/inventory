var logNameSpace = 'H.FK';
var dlog = require('../../lib/debuggers')(logNameSpace);

const mongoose = require('mongoose');

module.exports = (fCollectionName, fFieldName, localValue) => {

    dlog.fb('ForeignKey');
    var model = mongoose.model(fCollectionName);
	return new Promise((resolve, reject) => {

		model.findOne({ [fFieldName]: localValue }, (err, result) => {
			if (result) {
				return resolve(true);
			}
			else {
                return reject(new Error(
                `FK Constraint 'checkObjectsExists' for '${localValue.toString()}' failed`));
            }
		});
    });

    l.fo('ForeignKey');
}
