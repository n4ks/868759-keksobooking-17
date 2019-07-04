'use strict';

window.pin = (function () {

  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var pinBtnPattern = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();
  var pinsList = document.querySelector('.map__pins');
  var ads = [];

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

    // Фильтрация селектов
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
  // Карточки
  var cardFragment = document.createDocumentFragment();
  var cardPattern = document.querySelector('#card').content.querySelector('.map__card');

  var createCard = function (ad) {
    var card = cardPattern.cloneNode(true);
    var cardTitle = card.querySelector('.popup__title');
    var cardAddress = card.querySelector('.popup__text--address');
    var cardPrice = card.querySelector('.popup__text--price');
    var cardType = card.querySelector('.popup__type');
    var cardRooms = card.querySelector('.popup__text--capacity');
    var cardTime = card.querySelector('.popup__text--time');
    var cardFeatures = card.querySelector('.popup__features');
    var cardDescr = card.querySelector('.popup__description');
    var cardAvatar = card.querySelector('.popup__avatar');
    var cardPhotosList = card.querySelector('.popup__photos');
    var cardPhotoTemplate = cardPhotosList.querySelector('.popup__photo');

    var houseTypeMap = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };
    // генерируем карточку для каждого отфильтрованного пина

    cardTitle.textContent = ad.offer.title;
    cardAddress.textContent = ad.offer.address;
    cardPrice.textContent = ad.offer.price + '₽/ночь';
    cardType.textContent = houseTypeMap[ad.offer.type];
    cardRooms.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей.';
    cardTime.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    // cardFeatures.textContent =
    // Фото
    cardDescr.textContent = ad.offer.description;
    var photosFragment = document.createDocumentFragment();
    ad.offer.photos.forEach(function (photoSrc) {
      var photoNode = cardPhotoTemplate.cloneNode();
      photoNode.src = photoSrc;

      photosFragment.appendChild(photoNode);
    });
    cardPhotoTemplate.remove();
    cardPhotosList.appendChild(photosFragment);
    cardAvatar.src = ad.author.avatar;

    map.insertBefore(card, mapFiltersContainer);
  };

  pinsList.addEventListener('click', function (evt) {
    var target = evt.target;
    while (target !== pinsList) {
      if (target.tagName === 'BUTTON') {
        var ad = ads[target.getAttribute('id')];
        createCard(ad);
        return;
      }
      target = target.parentNode;
    }
  });

  return {
    renderPins: function (adsList) {
      // Ищем существующие отрисованные пины и удаляем их из DOM
      clearPinsList();
      adsList.slice(0, 5).forEach(function (ad, index) {
        pinsFragment.appendChild(generatePinElement(ad, index));
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
