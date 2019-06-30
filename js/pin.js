'use strict';

window.pin = (function () {

  var pinBtnPattern = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();
  var pinsList = document.querySelector('.map__pins');
  var generatePinElement = function (ad) {
    var pin = pinBtnPattern.cloneNode(true);
    var pinAvatar = pin.querySelector('img');

    pin.style.left = ad.location.x + 'px';
    pin.style.top = ad.location.y + 'px';
    pinAvatar.src = ad.author.avatar;
    pinAvatar.alt = ad.offer.title;
    return pin;
  };

  return {
    createPins: function () {
      var successCallback = function (response) {
        response.forEach(function (ad) {
          pinsFragment.appendChild(generatePinElement(ad));
          return pinsFragment;
        });
        pinsList.appendChild(pinsFragment);
      };
      window.backend.load(successCallback);
    }
  };
}());
