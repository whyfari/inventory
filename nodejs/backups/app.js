const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//initiates the database connection
const { mongoose } = require("./config/database");

const port = process.env.PORT_NJS_INVENTORY || 3000;
const portAngular = process.env.PORT_NG_INVENTORY || 4200;

const users = require('./routes/users');
const userTypes = require('./routes/userTypes');

var app = express();

//app.use(cors({ origin: `http://localhost:${portAngular}` }));
app.use(cors());
app.use(bodyParser.json());
// TODO_FA_ do we need to do this
//app.use(bodyParser.urlencoded({ extended: true }))


app.use('/users',users);
app.use('/userTypes',userTypes);

// Index Route
app.get('/', (req,res) => {
    res.send('_FA_ Iventory app backend root');
})


app.listen(port, () => console.log(`Server started at port : ${port}`));
