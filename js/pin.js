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
  var mapFeaturesFieldset = document.querySelector('.map__features');
  var mapFeatures = mapFeaturesFieldset.querySelectorAll('.map__checkbox');

  var features = {
    wifi: mapFeaturesFieldset.querySelector('#filter-wifi'),
    dishwasher: mapFeaturesFieldset.querySelector('#filter-dishwasher'),
    parking: mapFeaturesFieldset.querySelector('#filter-parking'),
    washer: mapFeaturesFieldset.querySelector('#filter-washer'),
    elevator: mapFeaturesFieldset.querySelector('#filter-elevator'),
    conditioner: mapFeaturesFieldset.querySelector('#filter-conditioner')
  };

  var priceRanges = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000
    }
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
              case adsPrice >= priceRanges.low.min && adsPrice <= priceRanges.low.max:
                priceFilter = 'low';
                break;
              case adsPrice >= priceRanges.middle.min && adsPrice <= priceRanges.middle.max:
                priceFilter = 'middle';
                break;
              case adsPrice >= priceRanges.high.min:
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
    // фильтрация чекбоксов
    // debugger;
    var selectedFeatures = [];
    for (var feature in features) {
      if (features.hasOwnProperty(feature)) {
        if (features[feature].checked) {
          selectedFeatures.push(feature);
        }
      }
    }

    filteredAds = filteredAds.filter(function (ad) {

      for (var i = 0; i < selectedFeatures.length; i++) {
        if (!ad.offer.features.includes(selectedFeatures[i])) {
          return false;
        }
      }
      return true;
    });
    console.log(filteredAds);
    window.pin.renderPins(filteredAds);
  };

  var setFilters = function () {
    var filtersArr = Array.from(mapFilters);
    filtersArr.forEach(function (filter) {
      filter.addEventListener('change', onFilterChange);
    });
  };
  setFilters();

  // собрать общий массив и обвесить в одном цикле
  var setFeaturesFilters = function () {
    var featuresArr = Array.from(mapFeatures);
    featuresArr.forEach(function (checkbox) {
      checkbox.addEventListener('change', onFilterChange);
    });
  };
  setFeaturesFilters();

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
