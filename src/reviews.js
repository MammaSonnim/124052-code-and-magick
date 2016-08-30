'use strict';

var REVIEWS_LOAD_URL = 'http://localhost:1506/api/reviews';
var callback = function(data) {
  console.log(data);
};

var loadReviews = function(url, cb) {
  var callbackName = 'cb' + Date.now();

  window[callbackName] = cb;

  var script = document.createElement('script');
  script.src = url + '?callback=' + callbackName;
  document.body.appendChild(script);
};

loadReviews(REVIEWS_LOAD_URL, callback);
