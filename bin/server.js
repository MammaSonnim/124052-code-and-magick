'use strict';

const express = require('express');
const finalhandler = require('finalhandler');
const path = require('path');
const serveStatic = express.static;


/** @constant {number} */
const PORT = parseInt(process.argv[2], 10) || 1506;


var serve = serveStatic(path.resolve(__dirname, '..', 'build'), {
  'index': ['index.html']
});

const app = express();


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
