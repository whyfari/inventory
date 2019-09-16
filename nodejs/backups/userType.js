const mongoose = require('mongoose');

const config = require('../config/database');

const schema = mongoose.Schema;

// user schema
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

const UserType = module.exports = mongoose.model('UserType', UserTypeSchema);

module.exports.getUserTypes = function (callback) {
    console.log('_FA_ finding all user types in model method');
    UserType.find((callback)); 
}

module.exports.getUserTypeById = function (id, callback) {
    console.log('_FA_ finding specific user types in model method');
    UserType.findById(id,callback);
}

module.exports.addUserType = function(newUserType,callback){
    console.log('_FA_ adding user in model method');
    newUserType.save(callback);
}

