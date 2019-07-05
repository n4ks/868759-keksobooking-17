'use strict';

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

var ads = [];

var onFilterChange = function () {
  ads = window.data;
  window.filteredAds = ads;

  // Фильтрация селектов
  if (ads) {
    for (var prop in filters) {
      if (filters.hasOwnProperty(prop) && filters[prop].value !== 'any') {
        if (prop === 'price') {
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
            return priceFilter === filters.price.value;
          });
        } else {
          window.filteredAds = window.filteredAds.filter(function (ad) {
            return ad.offer[prop].toString() === filters[prop].value;
          });
        }
      }
    }

    // фильтрация чекбоксов
    var selectedFeatures = [];
    for (var feature in features) {
      if (features.hasOwnProperty(feature)) {
        if (features[feature].checked) {
          selectedFeatures.push(feature);
        }
      }
    }

    window.filteredAds = window.filteredAds.filter(function (ad) {

      for (var i = 0; i < selectedFeatures.length; i++) {
        if (ad.offer.features.indexOf(selectedFeatures[i]) === -1) {
          return false;
        }
      }
      return true;
    });

    window.pin.renderPins(window.filteredAds);
  }
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
