var logNameSpace = 'M.user';
var dlog = require('../lib/debuggers')(logNameSpace);
const FKValidator = require('./helpers/foreign-key-helper');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema;

const consts= require('../constants/dbConsts');
const cUser = consts.user;

//TODO_FA change to 10
const saltWorkFactor = 1;

const UserSchema = schema({

  [cUser.fName]: {
    type: String,
    required: true,
  },

  [cUser.fEmail]: {
    type: String,
    required: true,
    unique: true
  },

  [cUser.fPassword]: {
    type: String,
    required: true
  },

  [cUser.fUserType_id]: {
    type: schema.ObjectId,
    required: true,

    validate: {
      validator: function(v) {
        return FKValidator(consts.userType.model, consts.userType.fId, v,true);
      },
      message: 'UserType does not exist' // TODO_FA_ doesn't get hit
    },
   errorMsg: 'UserType does not exist.' // TODO_FA_ doesn't get hit
  }
});

const User = module.exports = mongoose.model(cUser.model,
                                             UserSchema,
                                             cUser.coll);

module.exports.getUsers = function (callback) {
  dlog.fb('_FA_ finding all user in model method');
  User.find((callback)); 
}

module.exports.getUserById = function (id, callback) {
  User.findById(id,callback);
}

//TODO_FA this should only return one record since email should be unique
module.exports.getUserByEmail = function (email, callback) {
  User.findOne({email: email},callback);
}

module.exports.addUser = function(newUser,callback){
  dlog.dbm('AddUser ...: email: ' + newUser[cUser.fEmail]+ ' pass: ' + newUser[cUser.fPassword]);

  //TODO_FA are we covering all return cases?
  // TODO_FA 'err' waksn't printed by the callback function eventhough
  // i did see it in this log. test by not sending a password
  bcrypt.genSalt(saltWorkFactor, (err,salt) => {
    bcrypt.hash(newUser[cUser.fPassword], salt, (err, hash) => {
      if (err) {
        dlog.e('Error while hashing password: ' + err);
        callback(err)
      } else {
        newUser[cUser.fPassword]= hash;
        dlog.l3('hashed pass: ' + newUser[cUser.fPassword]);
        newUser.save(callback);
      }
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  //TODO_FA_ remove this log ofc
  dlog.dbm('comparePassword: ' + candidatePassword + ' == hashed?: ' + hash);
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      callback(err,null);
    } else {
      callback(null,isMatch);
    }
  });
}