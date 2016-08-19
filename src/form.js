'use strict';

window.form = (function() {
  var STARS_MIN = 3;
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
      this.onchange();
      cb();
    },

    close: function() {
      formContainer.classList.add('invisible');

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
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
     */
    isInputValid: function(input) {
      if (input.required) {
        return !!input.value;
      }
      return true;
    },

    /**
     * Validate inputs.
     */
    validate: function() {
      this.toggleClass(nameIndicator, 'invisible', this.isInputValid(nameInput));
      this.toggleClass(textIndicator, 'invisible', this.isInputValid(textInput));
    },

    /**
     * Actions for onchange event.
     * Set required attribute on textInput by check of rating.
     * Validate inputs and form.
     */
    onchange: function() {
      textInput.required = !!formMark && formMark.value < STARS_MIN;
      this.validate();
      this.setValid(this.isInputValid(nameInput) && this.isInputValid(textInput));
    },

    /**
     * Actions for oninput event.
     * Validate inputs and form.
     */
    oninput: function() {
      this.validate();
      this.setValid(this.isInputValid(nameInput) && this.isInputValid(textInput));
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
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };

  return form;
})();
