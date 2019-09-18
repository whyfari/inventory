var logNameSpace = 'M.userTypes';
var dlog = require('../lib/debuggers')(logNameSpace);

const mongoose = require('mongoose');

const config = require('../config/database');

const schema = mongoose.Schema;
const schemaName = 'UserType';

const UserTypeSchema = schema({
    
    description: {
        type: String,
        default: "User ..."
    },

    code: {
        type: String,
        required: true,
        unique: true
    }
});

const UserType = module.exports = mongoose.model(schemaName, UserTypeSchema);

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
