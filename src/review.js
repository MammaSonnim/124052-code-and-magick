'use strict';

define(function() {

  var createReviewElement = function(review) {
    var AUTHOR_IMG_SIZE = 124;
    var IMG_LOAD_TIMEOUT = 10000;
    var template = document.getElementById('review-template');
    var reviewSource = (template.content || template).querySelector('.review');
    var reviewElement = reviewSource.cloneNode(true);
    var reviewAuthor = reviewElement.querySelector('.review-author');
    var image = new Image();
    var ratingMap = ['two', 'three', 'four', 'five'];

    reviewElement.querySelector('.review-text').textContent = review.description;
    if (ratingMap[review.rating - 2]) {
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
  }
  return createReviewElement;
});