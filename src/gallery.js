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
    this.currentPicture = null;
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

    this.currentPicture = new Image();
    this.picturePreview.appendChild(this.currentPicture);
    this.overlay.classList.remove('invisible');
    this.setActivePicture(number);
    this.setActiveBtns();
  };

  Gallery.prototype.hide = function() {
    this.overlay.classList.add('invisible');
    this.picturePreview.removeChild(this.currentPicture);
    this.currentPicture = null;
    this.closeBtn.onclick = null;
    this.leftBtn.onclick = null;
    this.rightBtn.onclick = null;
  };

  Gallery.prototype.setActivePicture = function(number) {
    this.activePicture = number;
    this.currentPicture.src = this.pictures[number];
    this.currentPictureCount.innerHTML = number + 1;
  };

  Gallery.prototype.onCloseBtnClick = function() {
    this.hide();
  };

  Gallery.prototype.onLeftBtnClick = function() {
    if (this.activePicture > 0) {
      this.setActivePicture(this.activePicture - 1);
    }
    this.setActiveBtns();
  };

  Gallery.prototype.onRightBtnClick = function() {
    if (this.activePicture < this.pictures.length - 1) {
      this.setActivePicture(this.activePicture + 1);
    }
    this.setActiveBtns();
  };

  Gallery.prototype.setActiveBtns = function() {
    if (this.activePicture <= 0) {
      this.leftBtn.classList.add('disable');
      this.rightBtn.classList.remove('disable');
    } else if (this.activePicture >= this.pictures.length - 1) {
      this.rightBtn.classList.add('disable');
      this.leftBtn.classList.remove('disable');
    } else {
      this.rightBtn.classList.remove('disable');
      this.leftBtn.classList.remove('disable');
    }
  };

  return Gallery;
});
