const db = {
  db: "mongodb",
  dbName: "inv",
  port: 27017,
  host: "localhost"
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
  fUserType_id: 'userType_id'
}


module.exports = { db, fId, user, userType};