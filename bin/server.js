'use strict';

const express = require('express');
const finalhandler = require('finalhandler');
const serveStatic = express.static;
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

const config = require('./webpack.config.js');


/** @constant {number} */
const PORT = parseInt(process.argv[2], 10) || 1506;


var serve = serveStatic(config.devServer.contentBase, {'index': ['index.html', 'index.htm']});

// Setup server and enable webpack as a middleware
const app = express();
const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, require('./middleware.config.js'));
app.use(middleware);


// Setup server routing
app.get('/api/*', (req, res) => {
  console.log('API request');
  res.status(200).send();
}).get('*', serve);


// Start server
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Сервер запущен на порту %s. Откройте http://localhost:%s/ у себя в браузере. Чтобы остановить сервер, нажмите Ctrl+C', PORT, PORT);
});
