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
    numberOfSteps = a.reduce(function (prev, next) {
      return prev + next;
    });
    return 'Я прошёл ' + numberOfSteps + ' шагов';
  } else if (Array.isArray(a) && Array.isArray(b)) {
    for (var i = 0; i < a.length; i++) {
      arr.push(a[i] * b[i]);
    }
    distancePath = arr.reduce(function (prev, next) {
      return prev + next;
    });
    return 'Я прошёл ' + distancePath + ' метров';
  }
}
