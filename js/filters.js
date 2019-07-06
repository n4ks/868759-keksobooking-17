'use strict';
(function () {
  var DEFAULT_FILTER = 'any';

  var filters = Array.from(document.querySelectorAll('.map__filters select'));
  var filterFormElements = document.querySelector('.map__filters').querySelectorAll('.map__filter, .map__features > .map__checkbox');

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

  var filtersIdMap = {
    'housing-type': 'type',
    'hosuing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };

  var ads = [];

  var onFilterChange = function () {
    ads = window.data;
    window.filteredAds = ads;

    // Селекты
    filters.forEach(function (filter) {
      if (filter.value !== DEFAULT_FILTER) {
        if (filter.id === 'housing-price') {
          window.filteredAds = window.filteredAds.filter(function (ad) {
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
            return priceFilter === filter.value;
          });
        } else {
          window.filteredAds = window.filteredAds.filter(function (ad) {
            return ad.offer[filtersIdMap[filter.id]].toString() === filter.value;
          });
        }
      }
    });

    // Чекбоксы
    var selectedCheckboxes = document.querySelectorAll('.map__features input:checked');

    var selectedFeatures = [].map.call(selectedCheckboxes, function (checkbox) {
      return checkbox.value;
    });

    window.filteredAds = window.filteredAds.filter(function (ad) {

      for (var i = 0; i < selectedFeatures.length; i++) {
        if (ad.offer.features.indexOf(selectedFeatures[i]) === -1) {
          return false;
        }
      }
      return true;
    });

    window.util.preventDebounce(function () {
      window.pin.renderPins(window.filteredAds);
    });
  };

  var setFilters = function () {
    var formFilters = Array.from(filterFormElements);
    formFilters.forEach(function (filter) {
      filter.addEventListener('change', onFilterChange);
    });
  };
  setFilters();
}());
