'use strict';

window.CallbackRegistry = {};
var REVIEWS_LOAD_URL = 'http://localhost:1506/api/reviews';
var loadedReviews = null;

var loadReviews = function(url, cb) {
  var callbackName = 'cb' + Date.now();
  var script = document.createElement('script');

  script.src = url + '?callback=CallbackRegistry.' + callbackName;
  document.body.appendChild(script);

  window.CallbackRegistry[callbackName] = function(data) {
    cb(data);
    delete window.CallbackRegistry[callbackName];
    document.body.removeChild(script);
  };
};

var callback = function(data) {
  loadedReviews = data;
  console.log(loadedReviews);
};

loadReviews(REVIEWS_LOAD_URL, callback);
