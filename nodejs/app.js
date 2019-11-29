require('./config/env');
var logNameSpace = 'app';
var dlog = require('./lib/debuggers')(logNameSpace);
var log = require('./lib/log');
var cMes= require('./constants').mes;
var cApp= require('./constants').consts.app;
var cDb= require('./constants/dbConsts');
const cHttp= require('./constants/consts').cHttp;


dlog.e('ERROR test');
dlog.w('WARN test');
dlog.snh('SNH test');
dlog.td('TODO test');
dlog.why('Why test');
dlog.init('INIT test');

const express = require("express");
const bodyParser = require("body-parser");
//TODO remove
//const expressValidator = require("express-validator");

const cors = require("cors");
const  mongoose  = require("./config/database");

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const users = require('./routes/users');
const User = require('./models/user');
const routeFuncs = require('./routes/validation');
const userTypes = require('./routes/userTypes');

var app = express();
//TODO remove
//app.use(expressValidator()) // deprecated in v6

app.use(session({
    //name: 'sid', // default connect.sid
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection:  cDb.db.sessColl,
      ttl: 60 * 60 * 10,// session expires, in seconds, = 2 minutes
    }),
    saveUninitialized: false,
    secret: cDb.db.secret, //TODO enable
    cookie : {
      httpOnly: false, // TODO enable? default true
      //secure: true, // TODO enable? enable?
      //blah: 'blah', // json.prettify doesn't show it
      //maxAge: 1000 * 20, // cookie expires, in milliseconds, 2 minutes
    }

}));

//app.use(cors({ origin: `http://localhost:${portAngular}` }));
app.use(cors());

// TODO can use express.json instead?
app.use(bodyParser.json());

app.use( (req,res,next) => {

  routeFuncs.logReq(req,res);
  routeFuncs.setupSessionUser(req,res);

  next();
});


app.use((err, req, res, next) => {
  dlog.http('error', req.method + ' ' + req.originalUrl);
  if (err) {
    res.status(cHttp.BadReq);
    dlog.e('..Invalid Request data')
    res.send('Invalid Request data')
  } else {
    dlog.http('base', req.method + ' ' + req.originalUrl);
    next()
  }
})

app.get('/', (req,res) => {
  res.send('_FA_ Inventory app backend root');
})

app.use('/users',users);
app.use('/userTypes',userTypes);



app.listen(cApp.port, () => {////
  dlog.init(cMes.mText(
              cMes.mCode.SERVER_START,
              cApp.port));
});

//console.log("hi is : " , hi );