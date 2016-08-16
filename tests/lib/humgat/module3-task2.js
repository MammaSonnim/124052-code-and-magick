//
// humgat/module3-task2.js
//

var humgat = require('./utils/humgat.js').create();

require('./utils/humgat-common.js')(humgat);

var clipRect = {
  title: {
    left: 91, top: 353,
    width: 864, height: 263
  },
  form: {
    left: 225, top: 80,
    width: 565, height: 625
  }
};

var selector = {
  showFormButton: '.reviews-controls-new',
  mark2: '.review-mark-label-2',
  reviewName: '#review-name',
  reviewText: '#review-text'
};

humgat.on('page.open.success', function() {
  var config = this.config;

  this.setScrollPosition(0, this.dom.getHeight() - config.page.height);
  this.setClipRect(clipRect.title);
  this.renderStep();

  this.dom.click(selector.showFormButton);
  this.setClipRect(clipRect.form);
  this.renderStep();

  this.dom.click(selector.mark2);
  this.renderStep();

  this.dom.fillIn(selector.reviewName, 'Кекс');
  this.renderStep();

  this.dom.fillIn(
    selector.reviewText,
    'Не хватает пальцев на лапах для управления магом.');
  this.renderStep();

  this.emit('suite.done');
}).run();
