var logNameSpace = 'M.user';
var dlog = require('../lib/debuggers')(logNameSpace);
const dbF= require('./dbHelperFunc');

const mongoose = require('mongoose');

const schema = mongoose.Schema;

const consts= require('../constants/dbConsts');
const cThis = consts.user;

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

  //REMOVE
  [cThis.fP]: {
    type: String,
    required: true
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
        return dbF.checkDbField(consts.userType.model, consts.userType.fId, cThis.fUserType_id, v,true);
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

module.exports.getByEmail = function (email, callback) {
  dlog.fb('getByEmail');
  User.findOne({[cThis.fEmail] : email},callback);
}

module.exports.add = function(newUser, callback){
  dlog.fb('add');

  //REMOVE log
  dlog.dbm('add ...: email: ' + newUser[cThis.fEmail]+ ' pass: ' + newUser[cThis.fPassword]);

  dbF.getHash( newUser[cThis.fPassword], (err, hash) => {

    if ( err ) {
        callback(err);
    } else {
        //FARI temp storing raw passwords
        newUser[cThis.fP]=  newUser[cThis.fPassword];
        newUser[cThis.fPassword]= hash;
        dlog.l3('hashed pass: ' + newUser[cThis.fPassword]);
        newUser.save(callback);
    }
  });

}