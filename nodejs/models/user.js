var logNameSpace = 'M.user';
var dlog = require('../lib/debuggers')(logNameSpace);
const FKValidator = require('./helpers/foreign-key-helper');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema;

const consts= require('../constants/dbConsts');
const cThis = consts.user;

//TODO_FA change to 10
const saltWorkFactor = 1;

const UserSchema = schema({

  [cThis.fName]: {
    type: String,
    required: true,
  },

  [cThis.fEmail]: {
    type: String,
    required: true,
    unique: true
  },

  [cThis.fPassword]: {
    type: String,
    required: true
  },

  [cThis.fUserType_id]: {
    type: schema.ObjectId,
    required: true,

    validate: {
      validator: function(v) {
        return FKValidator(consts.userType.model, consts.userType.fId, v,true);
      },
      // WHY doesn't get hit
      message: 'UserType does not exist'
    },
   // WHY doesn't get hit
    errorMsg: 'UserType does not exist.'
  }
});

const User = module.exports = mongoose.model(cThis.model,
                                              UserSchema,
                                              cThis.coll);

module.exports.getAll = function (callback) {
  dlog.fb('getAll');
  User.find((callback));
}

module.exports.getById = function (id, callback) {
  dlog.fb('getById');
  User.findById(id,callback);
}

//TODO_FA this should only return one record since email should be unique
module.exports.getByEmail = function (email, callback) {
  dlog.fb('getByEmail');
  User.findOne({[cThis.fEmail] : email},callback);
}

module.exports.add = function(newUser,callback){
  dlog.fb('add');
  dlog.dbm('add ...: email: ' + newUser[cThis.fEmail]+ ' pass: ' + newUser[cThis.fPassword]);

  //TODO_FA are we covering all return cases?
  // TODO_FA 'err' waksn't printed by the callback function eventhough
  // i did see it in this log. test by not sending a password
  bcrypt.genSalt(saltWorkFactor, (err,salt) => {
    bcrypt.hash(newUser[cThis.fPassword], salt, (err, hash) => {
      if (err) {
        dlog.e('Error while hashing password: ' + err);
        callback(err)
      } else {
        newUser[cThis.fPassword]= hash;
        dlog.l3('hashed pass: ' + newUser[cThis.fPassword]);
        newUser.save(callback);
      }
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  //REMOVE remove this log ofc
  dlog.dbm('comparePassword: ' + candidatePassword + ' == hashed?: ' + hash);
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      callback(err,null);
    } else {
      callback(null,isMatch);
    }
  });
}