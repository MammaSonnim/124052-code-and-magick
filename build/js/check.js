'use strict';

function getMessage(a, b) {
  var numberOfSteps;
  var distancePath;

  if (typeof a === 'boolean') {
    return a ? 'Я попал в ' + b : 'Я никуда не попал';
  }
  if (typeof a === 'number') {
    return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
  }
  if (Array.isArray(a) && !Array.isArray(b)) {
    numberOfSteps = a.reduce(function(prev, current) {
      return prev + current;
    });
    return 'Я прошёл ' + numberOfSteps + ' шагов';
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    distancePath = a.reduce(function(prev, current, index) {
      console.log(current);
      return prev + current * (b[index] || 0);
    }, 0);
    return 'Я прошёл ' + distancePath + ' метров';
  }
  return false;
}
