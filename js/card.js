'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  // var cardFragment = document.createDocumentFragment();
  var cardPattern = document.querySelector('#card').content.querySelector('.map__card');
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
  var pinsList = document.querySelector('.map__pins');
  var ads = [];
  var houseTypeMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var CARD_FEATURE_CLASS = 'popup__feature';
  var featureMap = {
    'wifi': 'popup__feature--wifi',
    'dishwasher': 'popup__feature--dishwasher',
    'parking': 'popup__feature--parking',
    'washer': 'popup__feature--washer',
    'elevator': 'popup__feature--elevator',
    'conditioner': 'popup__feature--conditioner'
  };

  var createCard = function (ad) {

    cardTitle.textContent = ad.offer.title;
    cardAddress.textContent = ad.offer.address;
    cardPrice.textContent = ad.offer.price + '₽/ночь';
    cardType.textContent = houseTypeMap[ad.offer.type];
    cardRooms.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей.';
    cardTime.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    // Преимущества
    cardFeatures.hidden = false;
    // Убираем преимущества из карточки и добавляем только подходящие по фильтру
    while (cardFeatures.firstChild) {
      cardFeatures.removeChild(cardFeatures.firstChild);
    }

    if (ad.offer.features.length > 0) {
      var featuresFragment = document.createDocumentFragment();

      ad.offer.features.forEach(function (feature) {
        var featureElement = document.createElement('li');
        featureElement.classList.add(CARD_FEATURE_CLASS);
        featureElement.classList.add(featureMap[feature]);
        featuresFragment.appendChild(featureElement);
      });
      cardFeatures.appendChild(featuresFragment);
    } else {
      cardFeatures.hidden = true;
    }
    // Фотографии
    cardDescr.textContent = ad.offer.description;
    var photosFragment = document.createDocumentFragment();
    ad.offer.photos.forEach(function (photoSrc) {
      var photo = cardPhotoTemplate.cloneNode();
      photo.src = photoSrc;

      photosFragment.appendChild(photo);
    });

    cardPhotoTemplate.remove();
    cardPhotosList.appendChild(photosFragment);
    cardAvatar.src = ad.author.avatar;

    map.insertBefore(card, mapFiltersContainer);
  };

  pinsList.addEventListener('click', function (evt) {
    var target = evt.target;

    while (target !== pinsList) {
      if (target.tagName === 'BUTTON' && !target.classList.contains('map__pin--main')) {
        ads = window.filteredAds ? window.filteredAds : window.data;
        target.classList.add('map__pin--active');
        var ad = ads[target.getAttribute('id')];
        createCard(ad);
        return;
      }
      target = target.parentNode;
    }
  });
}());
