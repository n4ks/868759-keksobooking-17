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

  var Filter = {
    TYPE: mapFiltersForm.querySelector('#housing-type'),
    PRICE: mapFiltersForm.querySelector('#housing-price'),
    ROOMS: mapFiltersForm.querySelector('#housing-rooms'),
    GUESTS: mapFiltersForm.querySelector('#housing-guests')
  };
  var filteredAds = [];
  var onFilterChange = function () {
    // filteredAds = ads.filter(function (ad) {
    // return ad.offer.type === Filter.TYPE.value &&
    //   adPrice === Filter.PRICE.value &&
    //   ad.offer.rooms.toString() === Filter.ROOMS.value &&
    //   ad.offer.guests.toString() === Filter.GUESTS.value;


    var setTypeFilter = function () {
      if (Filter.TYPE.value !== 'any') {
        filteredAds = ads.filter(function (ad) {
          return ad.offer.type === Filter.TYPE.value;
        });
      }
    };
    setTypeFilter();
    var setPriceFilter = function () {
      // var adsPrice = ad.offer.price;
      if (Filter.PRICE.value !== 'any') {
        filteredAds = ads.filter(function (ad) {
          var adsPrice = ad.offer.price;
          var priceString;
          switch (true) {
            case adsPrice >= 0 && adsPrice <= 10000:
              priceString = 'low';
              break;
            case adsPrice >= 10000 && adsPrice <= 50000:
              priceString = 'middle';
              break;
            case adsPrice >= 50000:
              priceString = 'high';
              break;
            default:
              break;
          }
          return priceString === Filter.PRICE.value;
        });
      }
    };
    setPriceFilter();
    // var setRoomsFilter = function (adsRooms) {
    //   var rooms = null;
    //   if (adsRooms !== 'any') {
    //     rooms = adsRooms;
    //   }
    //   return rooms;
    // };

    // var setGuestsFilter = function (adsGuests) {
    //   var guests = null;
    //   if (adsGuests !== 'any') {
    //     guests = adsGuests;
    //   }
    //   return guests;
    // };

    // for (ad in ads) {
    //   if (ads.hasOwnProperty(ad)) {

    //   }
    // };

    // return setTypeFilter(ad.offer.type) === Filter.TYPE.value &&
    //   setPriceFilter(ad.offer.price) === Filter.TYPE.value &&
    //   setRoomsFilter(ad.offer.rooms) === Filter.ROOMS.value &&
    //   setGuestsFilter(ad.offer.guests) === Filter.GUESTS.value;
    // });

    window.pin.renderPins(filteredAds);
  };

  // Вешаем фильтры на все инпуты
  var setFilters = function () {
    var filters = Array.from(mapFilters);
    filters.forEach(function (filter) {
      filter.addEventListener('change', onFilterChange);
    });
  };
  setFilters();

  // Filter.TYPE.addEventListener('change', onTypeFilterChange);
  // Filter.ROOMS.addEventListener('change', onTypeFilterChange);
  // Filter.GUESTS.addEventListener('change', onTypeFilterChange);
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
