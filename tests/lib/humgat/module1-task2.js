//
// humgat/module1-task2.js
//

var humgat = require('./utils/humgat.js').create();

require('./utils/humgat-common.js')(humgat);

humgat.on('page.open.success', function() {
  this.dom.assertEqual(
    'function',
    function() { return typeof(getMessage); },
    'Функция должна быть определена'
  ).catch(function() {
    this.emit('suite.failed');
  });

  this.dom.assertEqual(
    'Я попал в дерево',
    function() { return getMessage(true, 'дерево'); },
    'a === true'
  );

  this.dom.assertEqual(
    'Я никуда не попал',
    function() { return getMessage(false); },
    'a === false'
  );

  this.dom.assertEqual(
    'Я прыгнул на 500 сантиметров',
    function() { return getMessage(5); },
    'a - число'
  );

  this.dom.assertEqual(
    'Я прошёл 10 шагов',
    function() { return getMessage([1, 2, 3, 4]); },
    'a - массив'
  );

  this.dom.assertEqual(
    'Я прошёл 20 метров',
    function() { return getMessage([1, 2, 3, 4], [2, 2, 2, 2]); },
    'a и b - массивы'
  );

  this.emit('suite.done');
}).run();
