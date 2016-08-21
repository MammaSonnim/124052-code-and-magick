'use strict';

const express = require('express');
const finalhandler = require('finalhandler');
const fs = require('fs');
const path = require('path');
const serveStatic = express.static;
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

const config = require('./webpack.config.js');


const DATA_DIR = 'data';
const DATA_FILE = 'reviews.json';


const isJSONPRequest = (req) => {
  return 'callback' in req.query;
};


const PORT = parseInt(process.argv[2], 10) || 1506;


var serve = serveStatic(config.devServer.contentBase, {'index': ['index.html', 'index.htm']});


// Setup server and enable webpack as a middleware
const app = express();
const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, require('./middleware.config.js'));
app.use(middleware);


// Setup server routing
app.
  get('/api/reviews', (req, res) => {
    if (!isJSONPRequest(req)) {
      res.sendStatus(404);
      return;
    }

    let dataFile = path.resolve(__dirname, DATA_DIR, DATA_FILE);
    fs.readFile(dataFile, 'utf-8', (err, data) => {
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.jsonp(JSON.parse(data));
    });
  }).
  get('*', serve);


// Start server
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Сервер запущен на порту %s. Откройте http://localhost:%s/ у себя в браузере. Чтобы остановить сервер, нажмите Ctrl+C', PORT, PORT);
});
