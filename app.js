"use strict";

const express = require("express");
const http = require("http");
const path = require('path');
const bodyParser = require("body-parser");
const firebase = require('firebase');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
  ws: true
})

const { app: appConf, firebase: firebaseConf } = require("./config");

const app = express();
const server = http.createServer(app);

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? appConf.port.dev : appConf.port.deploy;

if (isDeveloping) {
  require('./script/bundle')();

  app.all('/build/*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });

  app.get('/socket.io/*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });

  app.post('/socket.io/*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });

  app.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });
}

firebase.initializeApp(firebaseConf);

// const db = firebase.database();
// const patternRef = db.ref("/patterns");

server.listen(port);

require('babel-core/register');
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const scorer = require('./script/score');

require("./script/routes")(app, scorer);

proxy.on('error', (e) => {
  console.log('Could not connect to proxy, please try again...')
})

console.log(`${appConf.name} running at port: ${port}`);