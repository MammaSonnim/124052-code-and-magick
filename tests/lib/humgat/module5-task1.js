//
// humgat/module5-task1.js
//

var humgat = require('./utils/humgat.js').create();
var branchName = 'module5-task1';

require('./utils/humgat-common.js')(humgat);
require('./utils/humgat/redirects.js')(humgat);

var selector = {
  filterAll:  '.reviews-filter-item[for$=all]',
  filterGood: '.reviews-filter-item[for$=good]',
  filterBad:  '.reviews-filter-item[for$=bad]',
  filterPopular: '.reviews-filter-item[for$=popular]'
};

humgat.redirects({
  urlPattern: '//o0.github.io/assets/json/reviews.json',
  file: 'reviews.json'
}).on('resource.redirect', function() {
  this.on('page.loaded', function() {
    this.off('page.loaded');

    var branchConfig = this.config.tasks[branchName];
    var contents = branchConfig.contents;

    this.setScrollPosition(0, 1590);

    this.emit('filter.reviews.check', selector.filterAll,     contents.all, 'Все');
    this.emit('filter.reviews.check', selector.filterGood,    contents.good, 'Хорошие');
    this.emit('filter.reviews.check', selector.filterBad,     contents.bad, 'Плохие');
    this.emit('filter.reviews.check', selector.filterPopular, contents.popular, 'Популярные');

    this.emit('suite.done');
  });
}).on('filter.reviews.check', function(selector, contents, filterName) {
  var domContents;

  this.dom.click(selector);

  this.dom.assertEqual(
    contents,
    function() {
      var elements = document.querySelectorAll('.reviews-list .review-text');
      var content = [];

      if(elements) {
        for(var i = 0; i < elements.length; ++i) {
          content.push(elements[i].textContent);
        }
      }

      return content;
    },
    'Сравнение по фильтру `' + filterName + '`');
}).run();
