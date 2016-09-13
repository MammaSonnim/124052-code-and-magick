'use strict';

define([
  './form',
  './game',
  './gallery',
  './reviews'
], function(form, Game, Gallery) {
  var game = new Game(document.querySelector('.demo'));
  game.initializeLevelAndStart();
  game.setGameStatus(Game.Verdict.INTRO);

  var formOpenButton = document.querySelector('.reviews-controls-new');

  /** @param {MouseEvent} evt */
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();

    form.open(function() {
      game.setGameStatus(Game.Verdict.PAUSE);
      game.setDeactivated(true);
    });
  };

  form.onClose = function() {
    game.setDeactivated(false);
  };

  var galleryLinksCollection = document.querySelectorAll('.photogallery-image');
  var galleryPicturesCollection = document.querySelectorAll('.photogallery-image img');
  var pictures = Array.prototype.map.call(galleryPicturesCollection, function(picture) {
    return picture.src;
  });
  var gallery = new Gallery(pictures);

  Array.prototype.forEach.call(galleryLinksCollection, function(link, i) {
    link.addEventListener('click', function() {
      gallery.show(i);
    });
  });
});

