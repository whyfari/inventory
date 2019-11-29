const db = {
  db: "mongodb",
  dbName: "inv",
  port: 27017,
  host: "localhost",
  sessColl: "sessions",
  secret: 'leSecret'

}

const errors = {
  eMongoError : 'MongoError',
  eValidationError: 'ValidationError',
  eCodeDuplicate : 11000
}

// default id field
const fId = '_id';

// define constants relating to the userType collection
const userType = {
  model : 'userType',  // model name
  coll: 'userTypes',   // collection name
  fId: fId,            // field id name (default)
  fCode: 'code',       // field code name
  fDesc: 'desc'
}

const user = {
  model : 'user',
  coll: 'users',
  fId: fId,
  fName: 'name',
  fEmail: 'email',
  fPassword: 'password',
  fP: 'p',
  fUserType_id: 'userType_id'
}

module.exports = { db, errors, fId, user, userType};