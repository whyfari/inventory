var logNameSpace = 'M.user';
var dlog = require('../lib/debuggers')(logNameSpace);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const config = require('../config/database');
const FKValidator = require('./helpers/foreign-key-helper');

const schema = mongoose.Schema;

//TODO_FA change to 10
const saltWorkFactor = 1;

// user schema
const UserSchema = schema({
    
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String
    },

    //TODO_FA uncomment required/unique
    email: {
        type: String,
       // required: true,
        //unique: true
    },

    password: {
        type: String,
        required: true
    },

    // not wokring
    typeId: {
        type: schema.ObjectId,
        required: true,

        // ref: 'UserType', // TODO_FA_ is this needed?
        validate: {
            isAsync: true,
            validator: function(v) {
                return FKValidator('UserType','_id', v);
            },
            message: 'UserType does not exist' // TODO_FA_ doesn't get hit
        },
        errorMsg: 'UserType does not exist.' // TODO_FA_ doesn't get hit
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

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
    dlog.l('_FA_ adding user in model method');
    dlog.l('unhashed pass: ' + newUser.password)

    //TODO_FA are we covering all return cases?
    // TODO_FA 'err' wasn't printed by the callback function eventhough
    // i did see it in this log. test by not sending a password
    bcrypt.genSalt(saltWorkFactor, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                dlog.e('Error while hasing password: ' + err);
                callback(err)
            } else {
                newUser.password = hash;
                dlog.l3('hashed pass: ' + newUser.password)
                newUser.save(callback);
            }
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    dlog.dbm('comparePassword: ' + candidatePassword + ' == hashed?: ' + hash);
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) {
           dlog.e('bcrypt.compare threw error: ' + err);
           // TODO_FA handle gracefully ... make sure neither field is empty
           // throw err;
           callback(err,null);
        } else {
            callback(null,isMatch);
        }
    });
}