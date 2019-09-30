require('./config/env');
var logNameSpace = 'app';
var dlog = require('./lib/debuggers')(logNameSpace);
var cMes= require('./constants').mes;
var cApp= require('./constants').consts.app;


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

//app.use(cors({ origin: `http://localhost:${portAngular}` }));
app.use(cors());
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err) {
    dlog.e('Invalid Request data')
    res.send('Invalid Request data')
  } else {
    next()
  }
})

app.use('/users',users);
app.use('/userTypes',userTypes);

app.get('/', (req,res) => {
  res.send('_FA_ Iventory app backend root');
})


app.listen(cApp.port, () => {
  dlog.init(cMes.mText(
              cMes.mCode.SERVER_START,
              cApp.port));
  });
