'use strict';

window.pin = (function () {

  var pinBtnPattern = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();
  var pinsList = document.querySelector('.map__pins');
  var ads = [];

  var generatePinElement = function (ad) {
    var pin = pinBtnPattern.cloneNode(true);
    var pinAvatar = pin.querySelector('img');

    pin.style.left = ad.location.x + 'px';
    pin.style.top = ad.location.y + 'px';
    pinAvatar.src = ad.author.avatar;
    pinAvatar.alt = ad.offer.title;
    return pin;
  };

  var getData = function () {
    var successCallback = function (response) {
      ads = response;
    };

    var errorCallback = function (showErrorWindow) {
      showErrorWindow();
    };

    window.backend.load(successCallback, errorCallback);
  };

  // // Ждём пока загрузится DOM
  document.addEventListener('DOMContentLoaded', getData);

  return {
    createPins: function () {
      ads.slice(0, 5).forEach(function (ad) {
        pinsFragment.appendChild(generatePinElement(ad));
      });
      pinsList.appendChild(pinsFragment);
    },
    // getPins: function () {
    //   if (!ads) {

    //   }
    //   return ads;
    // }
  };
}());
