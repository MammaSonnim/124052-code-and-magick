'use strict';

window.CallbackRegistry = {};
var REVIEWS_LOAD_URL = 'http://localhost:1506/api/reviews?callback=CallbackRegistry.{name}';
var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var template = document.getElementById('review-template');
var reviewSource = (template.content || template).querySelector('.review');

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

var getReviewElement = function(review) {
  var AUTHOR_IMG_SIZE = 124;
  var IMG_LOAD_TIMEOUT = 10000;
  var reviewElement = reviewSource.cloneNode(true);
  var reviewRatingClassname = translateNumToString(review.rating);
  var reviewAuthor = reviewElement.querySelector('.review-author');
  var image = new Image();

  reviewElement.querySelector('.review-text').textContent = review.description;
  if (reviewRatingClassname !== null) {
    reviewElement.querySelector('.review-rating').classList.add('review-rating-' + reviewRatingClassname);
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
  reviewsFilter.classList.add('invisible');
  window.reviews = data;
  window.reviews.forEach(function(review) {
    reviewsContainer.appendChild(getReviewElement(review));
  });
  reviewsFilter.classList.remove('invisible');
};

var translateNumToString = function(number) {
  var result;

  switch (number) {
    case 2:
      result = 'two';
      break;
    case 3:
      result = 'three';
      break;
    case 4:
      result = 'four';
      break;
    case 5:
      result = 'five';
      break;
    default:
      result = null;
  }
  return result;
};

jsonp(REVIEWS_LOAD_URL, renderReviews);



