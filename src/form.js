'use strict';

window.form = (function() {
  var browserCookies = require('browser-cookies');

  /**
   * @const
   * @type {number}
   */
  var MS_IN_DAY = 1000 * 60 * 60 * 24;

  /**
   * Date (ISO 8601)
   * @const
   * @type {string}
   */
  var GRACE_BIRTHDAY = '1906-12-09';

  /**
   * @const
   * @type {number}
   */
  var STARS_MIN = 3;

  /**
   * Cookies names
   * @enum {string}
   */
  var ReviewCookies = {
    MARK: 'review-mark',
    NAME: 'review-name'
  };

  var formContainer = document.querySelector('.overlay-container');
  var reviewForm = document.querySelector('.review-form');
  var formMark = reviewForm.elements['review-mark'];
  var formCloseButton = reviewForm.querySelector('.review-form-close');
  var formSubmitButton = reviewForm.querySelector('.review-submit');
  var nameInput = reviewForm.elements['review-name'];
  var textInput = reviewForm.elements['review-text'];
  var formIndicators = reviewForm.querySelector('.review-fields');
  var nameIndicator = reviewForm.querySelector('.review-fields-name');
  var textIndicator = reviewForm.querySelector('.review-fields-text');

  var form = {
    onClose: null,
    isValid: true,

    /**
     * @param {Function} cb
     */
    open: function(cb) {
      formContainer.classList.remove('invisible');
      nameInput.required = true;
      formIndicators.classList.add('invisible');
      this.applyCookies();
      this.onchange();
      cb();
    },

    /**
     * On close remove attributes, switch classes
     * and clear form.
     */
    close: function() {
      formContainer.classList.add('invisible');
      nameInput.required = false;
      if (formIndicators.classList.contains('invisible')) {
        formIndicators.classList.remove('invisible');
      }
      reviewForm.reset();

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    },

    /**
     * Toggle class on element by 'statement' param.
     * IE doesn't support classList.toggle at all,
     * so method uses add/remove instead.
     * @param {HTMLElement} element
     * @param {string} className
     * @param {boolean} statement
     */
    toggleClass: function(element, className, statement) {
      if (statement) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    },

    /**
     * Check if input valid.
     * @param {HTMLInputElement} input
     * @return {boolean}
     */
    isInputValid: function(input) {
      return !input.required || !!input.value;
    },

    /**
     * Set 'disable' attribute on form-button
     * and toggle class on form-indicators by 'valid' param.
     * @param {boolean} valid
     */
    setValid: function(valid) {
      if (this.isValid !== valid) {
        this.isValid = valid;
        formSubmitButton.disabled = !valid;
        this.toggleClass(formIndicators, 'invisible', valid);
      }
    },

    /**
     * Validate inputs, and set state of form.
     */
    validate: function() {
      var isNameValid = this.isInputValid(nameInput);
      var isTextValid = this.isInputValid(textInput);

      this.toggleClass(nameIndicator, 'invisible', isNameValid);
      this.toggleClass(textIndicator, 'invisible', isTextValid);

      this.setValid(isNameValid && isTextValid);
    },

    /**
     * Calc expire date of cookies by date param.
     * @param {string} date
     * @return {number}
     */
    getDaysToExpire: function(date) {
      var now = new Date();
      var yearNow = now.getFullYear();
      var benchmark = new Date(date);

      benchmark.setFullYear(yearNow);
      if (now < benchmark) {
        benchmark.setFullYear(yearNow - 1);
      }
      return Math.floor((now - benchmark) / MS_IN_DAY);
    },

    setCookies: function() {
      var daysToExpire = this.getDaysToExpire(GRACE_BIRTHDAY);

      browserCookies.set(ReviewCookies.NAME, nameInput.value, {expires: daysToExpire});
      browserCookies.set(ReviewCookies.MARK, formMark.value, {expires: daysToExpire});
    },

    /**
     * Get cookies value and apply it to form.
     */
    applyCookies: function() {
      nameInput.value = browserCookies.get(ReviewCookies.NAME || '');
      formMark.value = browserCookies.get(ReviewCookies.MARK || STARS_MIN);
    },

    /**
     * Actions for onchange event.
     * Set required attribute on textInput by check of rating.
     * Validate form.
     */
    onchange: function() {
      textInput.required = !!formMark && formMark.value < STARS_MIN;
      this.validate();
    },

    /**
     * Actions for oninput event.
     * Validate form.
     */
    oninput: function() {
      this.validate();
    }
  };

  reviewForm.onchange = function() {
    form.onchange();
  };

  reviewForm.oninput = function() {
    form.oninput();
  };

  reviewForm.onsubmit = function(evt) {
    evt.preventDefault();
    form.setCookies();
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };

  return form;
})();
