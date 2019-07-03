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
  var mapFilters = mapFiltersForm.querySelectorAll('.map__filter');

  var filters = {
    type: mapFiltersForm.querySelector('#housing-type'),
    price: mapFiltersForm.querySelector('#housing-price'),
    rooms: mapFiltersForm.querySelector('#housing-rooms'),
    guests: mapFiltersForm.querySelector('#housing-guests')
  };

  var onFilterChange = function () {
    var filteredAds = ads;
    // Для фильтра цены описываем логику отдельно
    for (var prop in filters) {
      if (filters.hasOwnProperty(prop) && filters[prop].value !== 'any') {
        if (prop === 'price') {
          filteredAds = filteredAds.filter(function (ad) {
            var adsPrice = ad.offer.price;
            var priceFilter;
            switch (true) {
              case adsPrice >= 0 && adsPrice <= 10000:
                priceFilter = 'low';
                break;
              case adsPrice >= 10000 && adsPrice <= 50000:
                priceFilter = 'middle';
                break;
              case adsPrice >= 50000:
                priceFilter = 'high';
                break;
              default:
                break;
            }
            return priceFilter === filters.price.value;
          });
        } else {
          filteredAds = filteredAds.filter(function (ad) {
            return ad.offer[prop].toString() === filters[prop].value;
          });
        }
      }
    }

    window.pin.renderPins(filteredAds);
  };

  var setFilters = function () {
    var filtersArr = Array.from(mapFilters);
    filtersArr.forEach(function (filter) {
      filter.addEventListener('change', onFilterChange);
    });
  };
  setFilters();

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
    }
  };
}());
