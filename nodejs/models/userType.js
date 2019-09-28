var logNameSpace = 'M.userTypes';
var dlog = require('../lib/debuggers')(logNameSpace);
var cThis = require('../constants/dbConsts').userType;

const mongoose = require('mongoose');

const schema = mongoose.Schema;

const UserTypeSchema = schema({

  [cThis.fDesc]: {
    type: String,
    default: "Basic end user"
  },

  [cThis.fCode]: {
    type: String,
    required: true,
    unique: true
  }
});

const UserType = module.exports = mongoose.model(cThis.model,
                                                  UserTypeSchema,
                                                  cThis.coll);

module.exports.getAll = function (callback) {
  dlog.dbm('findUserTypes');
  UserType.find((callback));
}


module.exports.getById = function (id, callback) {
  dlog.dbm('getUserTypeById');
  UserType.findById(id,callback);
}

module.exports.add = function(newUserType,callback){
  dlog.dbm('addUserType');
  newUserType.save(callback);
}
