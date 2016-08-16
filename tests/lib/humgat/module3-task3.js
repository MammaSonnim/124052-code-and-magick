//
// humgat/module3-task3.js
//

var humgat = require('./utils/humgat.js').create();

require('./utils/humgat-common.js')(humgat);

var selector = {
  showFormButton: '.reviews-controls-new',
  mark4: '.review-mark-label-4',
  reviewName: '#review-name',
  reviewText: '#review-text',
  submitButton: '.review-submit'
};

var clipRect = {
  form: {
    left: 225, top: 80,
    width: 565, height: 625
  }
};

var nameValue = 'Кекс';
var textValue = 'Пендальф, ты стал белым теперь!';

humgat.on('page.open.success', function() {
  this.emit('need.review.form');
  this.emit('need.submit.review');

  this.on('page.loaded', function() {
    var nameCookie = humgat.getCookie('review-name') || {};
    var markCookie = humgat.getCookie('review-mark') || {};

    humgat.emit('need.review.form');
    humgat.setClipRect(clipRect.form);
    humgat.renderStep();

    humgat.assertEqual(
      nameValue,
      nameCookie.value,
      'Кука `review-name` должна иметь значение `' + nameValue + '`'
    );

    humgat.assertEqual(
      '4',
      markCookie.value,
      'Кука `review-mark` должна иметь значение `4`'
    );

    humgat.emit('suite.done');
  });
}).on('need.review.form', function() {
  var config = this.config;

  this.setScrollPosition(0, this.dom.getHeight() - config.page.height);
  this.dom.click(selector.showFormButton);
}).on('need.submit.review', function() {
  this.dom.click(selector.mark4);
  this.dom.fillIn(selector.reviewName, nameValue);
  this.dom.fillIn(selector.reviewText, textValue);
  this.dom.click(selector.submitButton);
}).on('resource.requested', function(requestData, networkRequest) {
  if(requestData.method === 'POST') {
    networkRequest.abort();
    this.page.reload();
  }
}).run();
