'use strict';

window.CallbackRegistry = {};
var REVIEWS_LOAD_URL = 'http://localhost:1506/api/reviews?callback=CallbackRegistry.{name}';

var jsonp = function(url, cb) {
  var callbackName = 'cb' + Date.now();
  var script = document.createElement('script');

  script.src = REVIEWS_LOAD_URL.replace('{name}', callbackName);
  document.body.appendChild(script);

  window.CallbackRegistry[callbackName] = function(data) {
    cb(data);
    delete window.CallbackRegistry[callbackName];
    document.body.removeChild(script);
  };
};

jsonp(REVIEWS_LOAD_URL, function(data) {
  window.reviews = data;
});
