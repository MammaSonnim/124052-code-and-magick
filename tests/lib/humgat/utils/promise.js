//
// humgat/utils/promise.js
//

// Simple, but enough

var Promise = function(fn) {
  var promise = this;

  var resolve = function() {
    promise.thenFn && promise.thenFn();
  };

  var reject = function() {
    promise.catchFn && promise.catchFn();
  };

  fn(resolve, reject);
};

var pp = Promise.prototype;

pp.then = function(thenFn, catchFn) {
  this.thenFn = thenFn;
  this.catchFn = catchFn;
};

pp.catch = function(catchFn) {
  this.thenFn = null;
  this.catchFn = catchFn;
};

module.exports = Promise;
