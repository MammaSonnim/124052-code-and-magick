//
// humgat/module4-task1.js
//

var humgat = require('./utils/humgat.js').create();

require('./utils/humgat-common.js')(humgat);
require('./utils/humgat/redirects.js')(humgat);

humgat.redirects({
  urlPattern: '//up.htmlacademy.ru/assets/js_intensive/jsonp/reviews.js',
  file: 'jsonp.js'
}).on('page.open.success', function() {
  this.setScrollPosition(0, 1590);
  this.setClipRect(138, 6, 768, 1232);

  this.renderStep();

  this.emit('suite.done');

  this.exit(0);
}).run();
