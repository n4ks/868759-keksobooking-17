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

  var clearPinsList = function () {
    var pins = document.querySelector('.map__pins').querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pins.length > 0) {
      var pinsArray = Array.from(pins);
      pinsArray.forEach(function (pin) {
        pin.remove();
      });
    }
  };

  // Фильтрация
  var mapFiltersForm = document.querySelector('.map__filters');
  var housingType = mapFiltersForm.querySelector('#housing-type');

  var filteredAds = [];
  housingType.addEventListener('change', function () {

    if (housingType.value !== 'any') {
      filteredAds = ads.filter(function (ad) {
        return ad.offer.type === housingType.value;
      });
    }
    window.pin.renderPins(filteredAds);
  });

  return {
    renderPins: function (adsList) {
      // Ищем существующие отрисованные пины и удаляем их из DOM
      clearPinsList();
      adsList.slice(0, 5).forEach(function (ad) {
        pinsFragment.appendChild(generatePinElement(ad));
      });

      pinsList.appendChild(pinsFragment);
    },
    onFirstLoadRender: function () {
      var successCallback = function (response) {
        ads = response;
        window.pin.renderPins(ads);
      };
      var errorCallback = function (showErrorWindow) {
        showErrorWindow();
      };

      window.backend.load(successCallback, errorCallback);
    },
    // getAds: function () {
    //   // return ads;
    // }
  };
}());
