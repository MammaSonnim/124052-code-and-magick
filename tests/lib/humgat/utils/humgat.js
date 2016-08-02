//
// humgat/utils/humgat.js
//

var EventEmitter = require('./event_emitter');
var fs = require('fs');

var logger = require('./logger.js');
var DOM = require('./humgat/dom.js');

var Humgat = function() {
  this.dom = new DOM(this);
  this.results = [];
};

Humgat.create = function() {
  return new Humgat();
};

module.exports = Humgat;

var hp = Humgat.prototype;

hp.on = EventEmitter.on;
hp.off = EventEmitter.off;
hp.emit = EventEmitter.emit;

hp.run = function() {
  this.emit('humgat.config');
  // this.initPhantomJs();
  this.emit('humgat.start');

  var config = this.config;
  var timeout = (config && config.timeout) || 2000;
  var humgat = this;

  setTimeout(function() {
    humgat.exit(1);
  }, timeout);
};

hp.setConfiguration = function setConfiguration(config) {
  this.config = config;
};

hp.initPhantomJs = function() {
  if(phantom.injectJs(this.config.shims)) {
    this.emit('humgat.shims.loaded');
  } else {
    this.emit('humgat.shims.failure');
  }
};

hp.getPage = function() {
  var page = this.page;

  if(!page) {
    page = this.page = require('webpage').create();
    this._initializePage(page);
    this._initializeResources(page);
  }

  return page;
};

hp._initializePage = function(page) {
  var humgat = this;

  page.onConsoleMessage = function(message) {
    humgat.emit('page.console', message);
  };

  page.onInitialized = function() {
    humgat.emit('page.initialized');
  };

  page.onLoadStarted = function() {
    humgat.emit('page.load.started');
  };

  page.onLoadFinished = function(status) {
    if(status === 'success') {
      humgat.emit('page.loaded');
    } else {
      humgat.emit('page.load.failure');
    }
  };
};

hp._initializeResources = function(page) {
  var humgat = this;

  page.onResourceRequested = function(requestData, networkRequest) {
    humgat.emit('resource.requested', requestData, networkRequest);
  };

  page.onResourceReceived = function(response) {
    humgat.emit('resource.received', response);
  };

  page.onResourceError = function(error) {
    humgat.emit('resource.error', error);
  };
};

hp.open = function() {
  var humgat = this;
  var page = this.getPage();
  var config = this.config;

  page.open(this.config.url, function(status) {
    if(status === 'success') {
      humgat.emit('page.open.success');
    } else {
      humgat.emit('page.open.failure');
    }
  });
};

hp.exit = function(code) {
  this.emit('humgat.exit', code);
  phantom.exit(code);
};

hp.debug = logger.debug;

hp.addResult = function(obj) {
  this.results.push(obj);
};

hp.displayResults = function() {
 this.debug(JSON.stringify(this.results));
};

hp.setScrollPosition = function(x, y) {
  if(arguments.length === 1) {
    this.page.scrollPosition = x;
  } else {
    this.page.scrollPosition = {
      left: x,
      top: y
    };
  }
};

hp.setClipRect = function(l, t, w, h) {
  if(arguments.length === 1) {
    this.page.clipRect = l;
  } else {
    this.page.clipRect = {
      left: l,
      top: t,
      width: w,
      height: h
    };
  }
};

hp.renderStep = function() {
  var config = this.config;
  var stepId, paddedId;
  var path;

  this.stepId || (this.stepId = 0);
  this.stepId += 1;

  stepId = this.stepId;

  paddedId = '0' + stepId;
  if(stepId > 9) {
    paddedId = '' + stepId;
  }

  path = config.screenshots + 'step-' + paddedId + '.png';

  this.emit('page.render', path);

  this.addResult({
    type: 'screenshot',
    path: path,
    step: 'step-' + paddedId
  });

  this.page.render(path);
};

hp.viewport = function(w, h) {
  var page = this.getPage();

  if(arguments.length === 1) {
    page.viewportSize = w;
  } else {
    page.viewportSize = {
      width: w,
      height: h
    };
  }
};

hp.compare = function(expected, actual) {
  if(typeof(expected) !== typeof(actual)) {
    return false;
  }

  if(typeof(expected) === 'string' ||
     typeof(expected) === 'number' ||
     typeof(expected) === 'undefined') {
    return expected === actual;
  }

  if(typeof(expected) === 'object' && expected && actual) {
    for(var key in expected) {
      if(expected[key] !== actual[key]) {
        this.debug('Compare at key: ' + key);
        this.debug('      expected: ' + expected[key]);
        this.debug('        actual: ' + actual[key]);

        return false;
      }
    }

    for(var key in actual) {
      if(expected[key] !== actual[key]) {
        this.debug('Compare at key: ' + key);
        this.debug('      expected: ' + expected[key]);
        this.debug('        actual: ' + actual[key]);

        return false;
      }
    }

    return true;
  }

  return false;
};

hp.assertEqual = function(expected, actual, message) {
  this.addResult({
    type: 'equal',
    expected: expected,
    actual: actual,
    title: message,
    result: this.compare(expected, actual)
  });
};

hp.getCookie = function(_name) {
  var cookies = this.page.cookies;
  var name, value;

  for(var i in cookies) {
    name = cookies[i].name;

    if(name === _name) {
      value = decodeURIComponent(cookies[i].value);

      return {
        name: name,
        value: value,
        expires: cookies[i].expires
      };
    }
  };

  return null;
};
