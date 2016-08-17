'use strict';

window.form = (function() {
  var STARS_MIN = 3;
  var NAME_MASK = /[а-яА-Яa-zA-Z0-9\- ]+/g;
  var formContainer = document.querySelector('.overlay-container');
  var reviewForm = document.querySelector('.review-form');
  var formCloseButton = reviewForm.querySelector('.review-form-close');
  var formSubmitButton = reviewForm.querySelector('.review-submit');
  var inputName = reviewForm.elements['review-name'];
  var inputReview = reviewForm.elements['review-text'];
  var formStars = reviewForm.elements['review-mark'];
  var checkedStar;

  var form = {
    onClose: null,
    isValid: false,
    isDisabled: true,

    /**
     * @param {Function} cb
     */
    open: function(cb) {
      formContainer.classList.remove('invisible');
      cb();
    },

    close: function() {
      formContainer.classList.add('invisible');

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    },

    disable: function() {
      if (form.isDisabled) {
        return;
      }
      form.isDisabled = true;
      formSubmitButton.setAttribute('disabled', 'disabled');
    },

    enable: function() {
      if (form.isDisabled) {
        form.isDisabled = false;
        formSubmitButton.removeAttribute('disabled', 'disabled');
      }
    },

    addRequired: function (source, target, minValue) {
      checkedStar = formStars.value;

      if (+source <= minValue && !target.getAttribute('required')) {
        target.setAttribute('required', 'required')
      }
      target.removeAttribute('required', 'required')
    },

    validateRequired: function (input) {
      if (input.hasAttribute('required')) {
        return this.isValid = input.value() ? true : false;
      }
      return this.isValid = true;
    },

    validateMasked: function (input, mask) {
      if (mask) {
        return this.isValid = mask.test(input) ? true : false;
      }
      return this.isValid = true;
    },

    validateInput: function (input, mask, indicator) {
      if  (this.validateRequired(input) && this.validateMasked(input, mask)) {
        indicator.classList.add('hide');
        this.isValid = true;
      }
      indicator.classList.remove('hide');
    }
  };

  form.disable();

  form.onsubmit = function(evt) {
    evt.preventDefault();
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };

  return form;
})();
