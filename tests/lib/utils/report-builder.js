var path = require('path');
var logger = require('./logger');
var config = require('../config');

var parameters = require('./parameters');
var branchName = parameters.getBranchName();
var branchConfig = config.phantomjs.tasks[branchName];

var etalonScreenshots = path.join(config.screenshots, branchName);
var targetScreenshots = config.phantomjs.screenshots;

etalonScreenshots = etalonScreenshots.substr('tests/'.length);
targetScreenshots = targetScreenshots.substr('tests/'.length);

// Synopsis: for use from runner
//
var ReportBuilder = function() {
  logger.debug('ReportBuilder.ctor()');
  this.etalonScreenshots = etalonScreenshots;
  this.targetScreenshots = targetScreenshots;
  this.steps = branchConfig.messages || {};
};

var div = function(className, content) {
  return "<div class='" +
    className + "'>" + content + "</div>";
};

var img = function(src) {
  return "<img src='" + src + "' alt=''>";
};

var template =
    "<html><head><link href='./css/style.css' rel='stylesheet' type='text/css'>" +
    "<title>Результаты проверки</title></head>" +
    "<body><h1>Результаты проверки</h1>{content}</body></html>";

Object.assign(ReportBuilder.prototype, {
  run: function(results) {
    var builder = this;

    var content = results.map(function(result) {
      if(result.type === 'equal') {
        return builder.getEqualContent(result);
      } else if(result.type === 'screenshot') {
        return builder.getScreenshotContent(result);
      }
    }).join('');

    return template.replace('{content}', content);
  },
  getEqualContent: function(result) {
console.log('equal');
    var content = div('step__title', result.title);
    if(!result.result) {
      content += '<ul><li>Ожидали: ' + result.expected + '</li>' +
        '<li>Получили: ' + result.actual + '</li></ul>';
    }

    var status = result.result ? 'success' : 'failure';

    return div('step step_' + status, content);
  },
  getScreenshotContent: function(result) {
    var content = this.getTextContent(result);

    var percent = result.percent;
    var status = 'unknown';


    if(typeof(percent) === 'number') {
      status = (percent >= config.treshold) ? 'success' : 'failure';
    }

    content += this.getImageContent(result);

    content = div('step step_' + status, content);

console.log('screenshot, exit');

    return content;
  },
  getTextContent: function(result) {
    var step = this.steps[result.step];
    var content = div("step__title", '* ' + step.title);

    var percent = result.percent;

    if(step.requirements) {
      content += div("step__requirements", step.requirements);
    }

    if(typeof(percent) === 'number') {
      content += div('step__result', 'Совпадение ' + percent.toFixed(2) + '%');
    }

    return content;
  },
  getImageContent: function(step) {
    var content =
        div('step__image step__image_etalon',
            img(step.expected)) +
        div('step__image step__image_target',
            img(step.path));

    return content;
  }
});

module.exports = ReportBuilder;
