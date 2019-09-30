require('./config/env');
var logNameSpace = 'app';
var dlog = require('./lib/debuggers')(logNameSpace);
var cMes= require('./constants').mes;
var cApp= require('./constants').consts.app;
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

const { mongoose } = require("./config/database");

const users = require('./routes/users');
const userTypes = require('./routes/userTypes');

var app = express();
//TODO remove
//app.use(expressValidator()) // deprecated in v6

app.use(function timeLog(req,res,next) {

  let today= new Date();
  dlog.l(today.toLocaleString());
  dlog.http(req.method + ' ' + req.originalUrl);
  next();
})

//app.use(cors({ origin: `http://localhost:${portAngular}` }));
app.use(cors());
app.use(bodyParser.json());


app.use((err, req, res, next) => {
  dlog.http('basee', req.method + ' ' + req.originalUrl);
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



app.listen(cApp.port, () => {
  dlog.init(cMes.mText(
              cMes.mCode.SERVER_START,
              cApp.port));
  });
