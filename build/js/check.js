'use strict';

function getMessage(a, b) {
  var numberOfSteps;
  var distancePath;
  var arr = [];

  if (typeof a === 'boolean') {
    return a ? 'Я попал в ' + b : 'Я никуда не попал';
  } else if (typeof a === 'number') {
    return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
  } else if (Array.isArray(a) && !Array.isArray(b)) {
    numberOfSteps = a.reduce(function(prev, current) {
      if (typeof current !== 'undefined') {
        return prev + current;
      } else {
        return false;
      }
    });
    return 'Я прошёл ' + numberOfSteps + ' шагов';
  } else if (Array.isArray(a) && Array.isArray(b)) {
    arr = a.map(function(value, i) {
      if (typeof b[i] !== 'undefined') {
        return value * b[i];
      } else {
        return false;
      }
    });
    distancePath = arr.reduce(function(prev, current) {
      return prev + current;
    });
    return 'Я прошёл ' + distancePath + ' метров';
  } else {
    return false;
  }
}
