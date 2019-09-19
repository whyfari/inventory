require('./config/env');
var logNameSpace = 'app';
var dlog = require('./lib/debuggers')(logNameSpace);


dlog.e('ERROR test');
dlog.w('WARN test');
dlog.snh('SNH test');
dlog.td('TODO test');
dlog.why('Why test');
dlog.init('INIT test');

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { mongoose } = require("./config/database");

const port = process.env.PORT_NJS_INVENTORY || 3000;
const portAngular = process.env.PORT_NG_INVENTORY || 4200;

const users = require('./routes/users');
const userTypes = require('./routes/userTypes');

var app = express();

//app.use(cors({ origin: `http://localhost:${portAngular}` }));
app.use(cors());
app.use(bodyParser.json());

app.use('/users',users);
app.use('/userTypes',userTypes);

app.get('/', (req,res) => {
  res.send('_FA_ Iventory app backend root');
})


app.listen(port, () => dlog.init(`Server started at port : ${port}`));