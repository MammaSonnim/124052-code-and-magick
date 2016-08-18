'use strict';

window.form = (function() {
  var STARS_MIN = 3;
  // var NAME_MASK = /[а-яА-Яa-zA-Z0-9\- ]+/g;
  var formContainer = document.querySelector('.overlay-container');
  var reviewForm = document.querySelector('.review-form');
  var formStars = reviewForm.elements['review-mark'];
  var formCloseButton = reviewForm.querySelector('.review-form-close');
  var formSubmitButton = reviewForm.querySelector('.review-submit');
  var nameInput = reviewForm.elements['review-name'];
  var textInput = reviewForm.elements['review-text'];
  // var textInput = document.querySelector('.review-text');
  var nameIndicator = reviewForm.querySelector('.review-fields-name');
  var textIndicator = reviewForm.querySelector('.review-fields-text');

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

    toggleRequired: function(target, source, minValue) {
      if (source && minValue) {
        var rating = source.value;
        if (rating < minValue) {
          textInput.setAttribute('required', 'required');
        } else {
          textInput.removeAttribute('required', 'required');
        }
      }
    },

    validateRequired: function(input) {
      if (input.hasAttribute('required')) {
        return (!!input.value);
      }
      return true;
    },

    // validateMasked: function(input, mask) {
    //   if (mask) {
    //     console.log(mask.test(input));
    //     return mask.test(input);
    //   }
    //   return true;
    // },

    validate: function(input, indicator, source, minValue) {
      this.toggleRequired(input, source, minValue);

      if (this.validateRequired(input)) {
        indicator.classList.add('invisible');
        this.isValid = true;
      } else {
        indicator.classList.remove('invisible');
        this.isValid = false;
      }

      if (form.isValid) {
        this.enable();
      }
      this.disable();
    }
  };

  // function addListeners(form, input) {
  //   function onInput() {
  //     form.validate(input, mask, indicator, source, minValue);
  //   }
  //   input.addEventListener('input', onInput);
  // }

  nameInput.setAttribute('required', 'required');

  reviewForm.onclick = function() {
    form.validate(textInput, textIndicator, formStars, STARS_MIN);
    // form.validate(nameInput, nameIndicator);
  };

  reviewForm.oninput = function() {
    form.validate(textInput, textIndicator, formStars, STARS_MIN);
    // form.validate(nameInput, nameIndicator);
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
