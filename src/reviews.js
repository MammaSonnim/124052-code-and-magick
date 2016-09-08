'use strict';

window.CallbackRegistry = {};
var REVIEWS_LOAD_URL = 'http://localhost:1506/api/reviews?callback=CallbackRegistry.{name}';
var AUTHOR_IMG_SIZE = 124;
var IMG_LOAD_TIMEOUT = 10000;
var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var template = document.getElementById('review-template');
var reviewSource = (template.content || template).querySelector('.review');
var ratingMap = ['two', 'three', 'four', 'five'];

var jsonp = function(url, cb) {
  var callbackName = 'cb' + Date.now();
  var script = document.createElement('script');

  document.body.appendChild(script);

  window.CallbackRegistry[callbackName] = function(data) {
    cb(data);
  };

  script.onload = script.onerror = function() {
    delete window.CallbackRegistry[callbackName];
    document.body.removeChild(script);
  };

  script.src = REVIEWS_LOAD_URL.replace('{name}', callbackName);
};

var createReviewElement = function(review) {
  var reviewElement = reviewSource.cloneNode(true);
  var reviewAuthor = reviewElement.querySelector('.review-author');
  var image = new Image();

  reviewElement.querySelector('.review-text').textContent = review.description;
  if (ratingMap[review.rating]) {
    reviewElement.querySelector('.review-rating').classList.add('review-rating-' + ratingMap[review.rating - 2]);
  }
  reviewAuthor.title = review.author.name;
  reviewAuthor.alt = review.author.name;

  image.onload = function() {
    clearTimeout(imageLoadTimeout);
    reviewAuthor.src = image.src;
    reviewAuthor.width = AUTHOR_IMG_SIZE;
    reviewAuthor.height = AUTHOR_IMG_SIZE;
  };

  image.onerror = function() {
    clearTimeout(imageLoadTimeout);
    reviewElement.classList.add('review-load-failure');
  };

  image.src = review.author.picture;

  var imageLoadTimeout = setTimeout(function() {
    image.src = '';
    image.onerror = null;
    image.onload = null;
    reviewElement.classList.add('review-load-failure');
  }, IMG_LOAD_TIMEOUT);

  return reviewElement;
};

var renderReviews = function(data) {
  window.reviews = data;
  window.reviews.forEach(function(review) {
    reviewsContainer.appendChild(createReviewElement(review));
  });
  reviewsFilter.classList.remove('invisible');
};

(function() {
  reviewsFilter.classList.add('invisible');
  jsonp(REVIEWS_LOAD_URL, renderReviews);
})();
