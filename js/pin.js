'use strict';

window.pin = (function () {
  var AD_HEADLINE = 'заголовок объявления';

  var pinBtnPattern = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();

  // гененируем объекты
  var ads = window.data.generateAds();

  // Создаём пины
  var generatePinElement = function (adsArray) {
    var pin = pinBtnPattern.cloneNode(true);
    var pinAvatar = pin.querySelector('img');

    pin.style.left = adsArray.location.x + 'px';
    pin.style.top = adsArray.location.y + 'px';
    pinAvatar.src = adsArray.author.avatar;
    pinAvatar.alt = AD_HEADLINE;
    return pin;
  };
  return {
    createPinsFragment: function () {
      for (var i = 0; i < ads.length; i++) {
        pinsFragment.appendChild(generatePinElement(ads[i]));
      }

      return pinsFragment;
    }
  };
}());
