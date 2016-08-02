// utils/logger.js
//
var log4js = require('log4js');
var config = require('../config');
var level = config.log_level;

var logger = log4js.getLogger();
logger.setLevel(level);

module.exports = logger;
