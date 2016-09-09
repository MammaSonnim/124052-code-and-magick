'use strict';

define( function() {
  window.CallbackRegistry = {};
  var REVIEWS_LOAD_URL = 'http://localhost:1506/api/reviews?callback=CallbackRegistry.{name}';

  return function jsonp(cb) {
    var callbackName = 'cb' + Date.now();
    var script = document.createElement('script');
    script.async = true;

    document.body.appendChild(script);

    window.CallbackRegistry[callbackName] = function (data) {
      cb(false, data);
    };

    script.onload = function () {
      delete window.CallbackRegistry[callbackName];
      document.body.removeChild(script);
    };

    script.onerror = function () {
      cb(true);
      delete window.CallbackRegistry[callbackName];
      document.body.removeChild(script);
    };

    script.src = REVIEWS_LOAD_URL.replace('{name}', callbackName);
  }
});