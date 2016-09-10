'use strict';

define([
  './load',
  './review'
], function(load, createReviewElement) {

  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsFilter = document.querySelector('.reviews-filter');

  reviewsFilter.classList.add('invisible');

  load(function(error, data) {
    if (error) {
      console.log('error script!');
    } else {
      data.forEach(function(review) {
        reviewsContainer.appendChild(createReviewElement(review));
      });
    }
    reviewsFilter.classList.remove('invisible');
  });
});

