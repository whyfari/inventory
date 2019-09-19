var dlog = require('../lib/debuggers')('database') 

const mongoose = require('mongoose');
mongoose.set('debug', true)
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://localhost:27017/inventory',{useNewUrlParser: true}, (err) => {

   if ( !err )
      dlog.init('MongoDB connection succeeded');
   else
      dlog.init('Error in DB connection: ' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;
