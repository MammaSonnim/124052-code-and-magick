'use strict';

define(function() {
  var Gallery = function(pictures) {
    this.overlay = document.querySelector('.overlay-gallery');
    this.pictures = pictures;
    this.activePicture = 0;
    this.leftBtn = this.overlay.querySelector('.overlay-gallery-control-left');
    this.rightBtn = this.overlay.querySelector('.overlay-gallery-control-right');
    this.currentPictureCount = this.overlay.querySelector('.preview-number-current');
    this.totalPicturesCount = this.overlay.querySelector('.preview-number-total');
    this.totalPicturesCount.innerHTML = this.pictures.length;
    this.closeBtn = this.overlay.querySelector('.overlay-gallery-close');
    this.picturePreview = this.overlay.querySelector('.overlay-gallery-preview');
  };

  Gallery.prototype.show = function(number) {
    var self = this;

    this.closeBtn.onclick = function() {
      self.onCloseBtnClick();
    };
    this.leftBtn.onclick = function() {
      self.onLeftBtnClick();
    };
    this.rightBtn.onclick = function() {
      self.onRightBtnClick();
    };
    this.overlay.classList.remove('invisible');
    this.setActivePicture(number);
  };

  Gallery.prototype.hide = function() {
    this.overlay.classList.add('invisible');
    this.closeBtn.onclick = null;
    this.leftBtn.onclick = null;
    this.rightBtn.onclick = null;
  };

  Gallery.prototype.setActivePicture = function(number) {
    this.activePicture = number;
    var currentPicture = new Image();
    currentPicture.src = this.pictures[number];
    var prevPicture = this.picturePreview.querySelector('img');
    if (prevPicture) {
      this.picturePreview.replaceChild(currentPicture, prevPicture);
    } else {
      this.picturePreview.appendChild(currentPicture);
    }
    this.currentPictureCount.innerHTML = number + 1;
  };

  Gallery.prototype.onCloseBtnClick = function() {
    this.hide();
  };

  Gallery.prototype.onLeftBtnClick = function() {
    if (this.activePicture > 0) {
      this.setActivePicture(this.activePicture - 1);
    }
  };

  Gallery.prototype.onRightBtnClick = function() {
    if (this.activePicture < this.pictures.length - 1) {
      this.setActivePicture(this.activePicture + 1);
    }
  };

  return Gallery;
});
