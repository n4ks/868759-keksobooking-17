'use strict';

window.pin = (function () {
  var PINS_COUNT = {
    BEGIN: 0,
    END: 5
  };

  var pinBtnPattern = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();
  var pinsList = document.querySelector('.map__pins');

  var generatePinElement = function (ad, index) {
    var pin = pinBtnPattern.cloneNode(true);
    var pinAvatar = pin.querySelector('img');
    pin.style.left = ad.location.x + 'px';
    pin.style.top = ad.location.y + 'px';
    pin.setAttribute('id', index);
    pinAvatar.src = ad.author.avatar;
    pinAvatar.alt = ad.offer.title;

    return pin;
  };

  var clearPinsList = function () {
    var pins = document.querySelector('.map__pins').querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pins.length > 0) {
      var pinsArray = Array.from(pins);
      pinsArray.forEach(function (pin) {
        pin.remove();
      });
    }
  };

  return {
    renderPins: function (data) {
      // Ищем существующие отрисованные пины и удаляем их из DOM
      clearPinsList();
      data.slice(PINS_COUNT.BEGIN, PINS_COUNT.END).forEach(function (ad, index) {
        pinsFragment.appendChild(generatePinElement(ad, index));
      });
      pinsList.appendChild(pinsFragment);
    },
  };
}());
