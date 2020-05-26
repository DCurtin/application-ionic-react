require("dotenv").config();
var path = require('path');
var express = require('express');
var session = require('express-session');
var router = require('express').Router();
var bodyParser = require('body-parser');
var {
  Client
} = require('pg');
var jsforce = require('jsforce');


var app = express();
app.use(session({
  secret: 'S3CRE7',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, "client", "build")));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// var connectionString = process.env.DATABASE_URL;

// const client = new Client({
//   connectionString: connectionString,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
// client.connect();

app.use(router);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});



var port = process.env.PORT || 3030;

app.listen(port, () => console.log(port));