const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { mongoose } = require("./db.js");

const port = process.env.PORT_NJS_INVENTORY || 3000;
const portAngular = process.env.PORT_NG_INVENTORY || 4200;

var app = express();

app.use(bodyParser.json());
// TODO_FA do we need to do this
//app.use(bodyParser.urlencoded({ extended: true }))
//Saba is here making her first change

app.use(cors({ origin: `http://localhost:${portAngular}` }));

app.listen(port, () => console.log(`Server started at port : ${port}`));
