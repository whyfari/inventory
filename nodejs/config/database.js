var log = require('debug')('app:database') 

const mongoose = require('mongoose');
mongoose.set('debug', true)

// disable colors in debug mode
//mongoose.set('debug', { color: false })

mongoose.connect('mongodb://localhost:27017/Inventory',{useNewUrlParser: true}, (err) => {

   if ( !err )
      log('MongoDB connection succeeded');
   else
      log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;