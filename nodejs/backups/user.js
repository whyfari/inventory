const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const config = require('../config/database');
const FKHekper = require('./helpers/foreign-key-helper');

const schema = mongoose.Schema;

//TODO_FA change to 10
const saltWorkFactor = 1;

// user schema
const UserSchema = schema({
    
    firstName: {
        type: String
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

    typeId: {
        type: String,
 //       required: true
    }


//    // not wokring
//    typeId: {
//        type: schema.ObjectId,
//        ref: 'UserType',
//        validate: {
//            isAsync: true,
//            validator: function(v) {
//                return FKHekper(mongoose.model('UserType'),v);
//            },
//            message: 'UserType does not exist'
//        }
//    }
//
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUsers = function (callback) {
    console.log('_FA_ finding all user in model method');
    User.find((callback)); 
}

module.exports.getUserById = function (id, callback) {
    UserSchema.findById(id,callback);
}

module.exports.addUser = function(newUser,callback){
    console.log('_FA_ adding user in model method');
    console.log('unhashed pass: ' + newUser.password)

    //TODO_FA are we covering all return cases?
    // TODO_FA 'err' wasn't printed by the callback function eventhough
    // i did see it in this log. test by not sending a password
    bcrypt.genSalt(saltWorkFactor, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                console.log('Error while hasing password: ' + err);
                callback(err)
            } else {
                newUser.password = hash;
                console.log('hashed pass: ' + newUser.password)
                newUser.save(callback);
            }
        });
    });
}