var logNameSpace = 'M.userTypes';
var dlog = require('../lib/debuggers')(logNameSpace);
var cUserType = require('../constants/dbConsts').userType;

const mongoose = require('mongoose');

const schema = mongoose.Schema;

const UserTypeSchema = schema({

  [cUserType.fDesc]: {
    type: String,
    default: "Basic end user"
  },

  [cUserType.fCode]: {
    type: String,
    required: true,
    unique: true
  }
});

const UserType = module.exports = mongoose.model(cUserType.model,
                                                  UserTypeSchema,
                                                  cUserType.coll);

module.exports.getUserTypes = function (callback) {
  dlog.dbm('findUserTypes');
  UserType.find((callback)); 
}

module.exports.getUserTypeById = function (id, callback) {
  dlog.dbm('getUserTypeById');
  UserType.findById(id,callback);
}

module.exports.addUserType = function(newUserType,callback){
  dlog.dbm('addUserType');
  newUserType.save(callback);
}
