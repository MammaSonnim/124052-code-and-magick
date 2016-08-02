'use strict';

function getMessage(a, b) {
    var message;
    var numberOfSteps;
    var distancePath;

    if ( typeof a == 'boolean' ) {
        message = a ? 'Я попал в ' + b : 'Я никуда не попал';

    } else if ( typeof a == 'number' ) {
        message = 'Я прыгнул на ' + (a * 100) + ' сантиметров';

    } else if ( typeof a == 'object' && !(typeof b == 'object') ) {
        numberOfSteps = a.reduce(function(a, b) {
            return a + b;
        });
        message = 'Я прошёл ' + numberOfSteps + ' шагов';

    } else if ( typeof a == 'object' && typeof b == 'object' ) {
        var arr = [];

        for (var i=0; i < a.length; i++) {
            arr.push( a[i] * b[i] );

        }

        distancePath = arr.reduce(function(a, b) {
            return a + b;
        });

        message = 'Я прошёл ' + distancePath + ' метров';
    }

    return message;

};