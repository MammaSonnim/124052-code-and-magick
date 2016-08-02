//
// humgat/utils/humgat-common.js
//

var humgatDebug = true;
var logger = require('./logger');

var humgatCommon = function(humgat) {
  if(humgatDebug) {
    humgat.onSubscribe = function(name) {
      // logger.debug('Subscribe to `' + name + '`');
    };

    humgat.onUnsubscribe = function(name) {
      // logger.debug('Unsubscribe from `' + name + '`');
    };

    humgat.onEmit = function(name, args) {
      if(name.indexOf('console') > -1 ||
         name.indexOf('server.read') > -1 ||
         // name.indexOf('received') > -1 ||
         name.indexOf('page.') === 0
        ) {
        logger.debug('Emit `' + name + '`, ' + JSON.stringify(args));
      }
    };
  }

  var storeResults = function() {
    var config = humgat.config;
    var fs = require('fs');

    fs.write(config.results, JSON.stringify(humgat.results));
  };

  humgat.
    on('humgat.config', function() {
      this.setConfiguration(require('../../config/index.js').phantomjs);
    }).
    on('page.initialized', function() {
      var page = this.getPage();
      var config = this.config;

      if(page.injectJs(config.shims)) {
        this.emit('page.shims.loaded');
      } else {
        this.emit('page.shims.failure');
      }
    }).
    on('page.shims.failure', function() {
      this.exit(1);
    }).
    on('humgat.start', function() {
      var config = this.config;

      this.viewport(config.page);
      this.open(this.config.url);
    }).
    on('suite.done', function() {
      storeResults();
      this.exit(0);
    }).
    on('suite.failure', function() {
      storeResults();
      this.exit(0);
    });
};

module.exports = humgatCommon;
