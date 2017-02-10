"use strict";
 
const express = require("express");
const http = require("http");
const path = require('path');
const bodyParser = require("body-parser");

const { app: appConf } = require("./config");

const app = express();
const server = http.createServer(app);

server.listen(appConf.port);

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public/static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

require("./routes")(app);

console.log(`${appConf.name} running at port: ${appConf.port}`);
