var dlog = require('../lib/debuggers')('database')
var cDb= require('../constants/dbConsts').db
var cMes= require('../constants/').mes

const mongoose = require('mongoose');

mongoose.set('debug', true)
mongoose.set('useCreateIndex', true);

var connStr = `${cDb.db}://${cDb.host}:${cDb.port}/${cDb.dbName}`;

mongoose.connect( connStr,
                  {useNewUrlParser: true},
                  (err) => {
   if ( !err ) {
      dlog.init(cMes.mText(cMes.mCode.DB_CONN_SUCC, connStr));
   } else {
      dlog.init(cMes.mText(cMes.mCode.DB_CONN_FAIL, err));
   }
});

module.exports = mongoose;
