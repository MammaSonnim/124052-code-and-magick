//
// humgat/utils/humgat-dom.js
//

var Promise = require('../promise.js');

var DOM = function(humgat) {
  this.humgat = humgat;
};

module.exports = DOM;

var dp = DOM.prototype;

dp.assertEqual = function(expected, actual, message) {
  var humgat = this.humgat;
  var debug = humgat.debug;
  var page = humgat.getPage();
  var result, compareResult;

  debug('assertEqual: ' + message);

  if(typeof(actual) === 'function') {
    actual = page.evaluate(actual);
  }

  compareResult = humgat.compare(expected, actual);

  result = {
    type: 'equal',
    title: message,
    expected: expected,
    actual: actual,
    result: compareResult
  };

  humgat.addResult(result);

  return new Promise(function(resolve, reject) {
    if(compareResult) {
      humgat.emit('assertion.ok', result);
      resolve(result);
    } else {
      humgat.emit('assertion.failed', result);
      reject(result);
    }
  });
};

dp.getHeight = function() {
  var page = this.humgat.getPage();

  return page.evaluate(function() {
    return document.body.scrollHeight;
  });
};

dp.click = function(selector) {
  var page = this.humgat.getPage();

  var br = page.evaluate(function(selector) {
    var element = document.querySelector(selector);
    return element.getBoundingClientRect();
  }, selector);

  page.sendEvent('click', br.left + 1, br.top + 1);
};

dp.fillIn = function(selector, value) {
  var page = this.humgat.getPage();

  this.click(selector);
  page.sendEvent('keypress', value);
};
