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
    isValid: false,
    isDisabled: false,

    /**
     * @param {Function} cb
     */
    open: function(cb) {
      formContainer.classList.remove('invisible');
      nameInput.setAttribute('required', 'required');
      textIndicator.classList.add('invisible');
      this.disable();
      cb();
    },

    close: function() {
      formContainer.classList.add('invisible');

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    },

    disable: function() {
      if (this.isDisabled) {
        return;
      }
      this.isDisabled = true;
      formSubmitButton.setAttribute('disabled', 'disabled');
      formIndicators.classList.remove('invisible');
    },

    enable: function() {
      if (!this.isDisabled) {
        return;
      }
      this.isDisabled = false;
      formSubmitButton.removeAttribute('disabled');
      formIndicators.classList.add('invisible');
    },

    toggleInputRequired: function(target, mark, minValue) {
      if (mark && minValue) {
        var rating = mark.value;
        if (rating < minValue) {
          textInput.setAttribute('required', 'required');
        } else {
          textInput.removeAttribute('required');
        }
      }
    },

    validateInput: function(input, indicator) {
      if (input.hasAttribute('required')) {
        if (input.value) {
          indicator.classList.add('invisible');
          this.isValid = true;
        } else {
          indicator.classList.remove('invisible');
          this.isValid = false;
        }
      }

      if (this.isValid) {
        this.enable();
      } else {
        this.disable();
      }
    }
  };

  reviewForm.onchange = function() {
    form.toggleInputRequired(textInput, formMark, STARS_MIN);
    form.validateInput(nameInput, nameIndicator);
    form.validateInput(textInput, textIndicator);
  };

  reviewForm.oninput = function() {
    form.validateInput(nameInput, nameIndicator);
    form.validateInput(textInput, textIndicator);
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
