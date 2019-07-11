'use strict';
(function () {
  var DEFAULT_FILTER = 'any';
  var PRICE_FILTER_ID = 'housing-price';
  var NO_MATCH_FOUND = -1;
  var PriceFilterValues = {
    LOW: 'low',
    MID: 'middle',
    HIGH: 'high'
  };

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

  var filterIdMap = {
    'housing-type': 'type',
    'hosuing-price': 'price',
    'housing-guests': 'guests',
    'housing-rooms': 'rooms'
  };

  var ads = [];

  var onFilterChange = function () {
    ads = window.data;
    window.filteredAds = ads;

    // Селекты
    filters.forEach(function (filter) {
      if (filter.value !== DEFAULT_FILTER) {
        if (filter.id === PRICE_FILTER_ID) {
          window.filteredAds = window.filteredAds.filter(function (ad) {
            var adsPrice = ad.offer.price;
            var priceFilter;
            switch (true) {
              case adsPrice >= priceRanges.low.min && adsPrice <= priceRanges.low.max:
                priceFilter = PriceFilterValues.LOW;
                break;
              case adsPrice >= priceRanges.middle.min && adsPrice <= priceRanges.middle.max:
                priceFilter = PriceFilterValues.MID;
                break;
              case adsPrice >= priceRanges.high.min:
                priceFilter = PriceFilterValues.HIGH;
                break;
              default:
                break;
            }
            return priceFilter === filter.value;
          });
        } else {
          window.filteredAds = window.filteredAds.filter(function (ad) {
            return ad.offer[filterIdMap[filter.id]].toString() === filter.value;
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
        var selectedFeature = ad.offer.features.indexOf(selectedFeatures[i]);
        if (selectedFeature === NO_MATCH_FOUND) {
          return false;
        }
      }
      return true;
    });

    // Закрываем карточку и обрабатываем debounce
    var map = document.querySelector('.map');
    var card = map.querySelector('.map__card');
    if (map.contains(card)) {
      window.card.closeCard();
    }
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
