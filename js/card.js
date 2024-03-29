'use strict';

window.card = (function () {
  var CARD_FEATURE_CLASS = 'popup__feature';

  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var cardPattern = document.querySelector('#card').content.querySelector('.map__card');
  var card;
  var cardCloseBtn;
  var target;
  var prevBtn = null;

  var pinsList = document.querySelector('.map__pins');
  var ads = [];
  var houseTypeMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var featureMap = {
    'wifi': 'popup__feature--wifi',
    'dishwasher': 'popup__feature--dishwasher',
    'parking': 'popup__feature--parking',
    'washer': 'popup__feature--washer',
    'elevator': 'popup__feature--elevator',
    'conditioner': 'popup__feature--conditioner'
  };

  var handleFeatures = function (featuresContainer) {
    featuresContainer.hidden = false;
    // Убираем преимущества из карточки и добавляем только подходящие по фильтру
    while (featuresContainer.firstChild) {
      featuresContainer.removeChild(featuresContainer.firstChild);
    }
  };

  var toggleFeaturesVisibility = function (featuresContainer, pinObj) {
    if (pinObj.offer.features.length > 0) {
      var featuresFragment = document.createDocumentFragment();

      pinObj.offer.features.forEach(function (feature) {
        var featureElement = document.createElement('li');
        featureElement.classList.add(CARD_FEATURE_CLASS);
        featureElement.classList.add(featureMap[feature]);
        featuresFragment.appendChild(featureElement);
      });
      featuresContainer.appendChild(featuresFragment);
    } else {
      featuresContainer.hidden = true;
    }
  };

  var handlePhotos = function (photoTemplate, pinObj) {
    var photosFragment = document.createDocumentFragment();
    pinObj.offer.photos.forEach(function (photoSrc) {
      var photo = photoTemplate.cloneNode();
      photo.src = photoSrc;
      photosFragment.appendChild(photo);
    });

    return photosFragment;
  };

  var updatePhotos = function (photoTemplate, photoContainer, avatar, pinObj) {
    photoTemplate.remove();
    var photosFragment = handlePhotos(photoContainer, pinObj);
    photoContainer.appendChild(photosFragment);
    avatar.src = pinObj.author.avatar;
  };

  // Заполняем карточку данными из объекта
  var createCard = function (ad) {
    card = cardPattern.cloneNode(true);
    cardCloseBtn = card.querySelector('.popup__close');
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

    var fillCardInfo = function () {
      cardTitle.textContent = ad.offer.title;
      cardAddress.textContent = ad.offer.address;
      cardPrice.textContent = ad.offer.price + '₽/ночь';
      cardType.textContent = houseTypeMap[ad.offer.type];
      cardRooms.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей.';
      cardTime.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      cardDescr.textContent = ad.offer.description;
    };

    fillCardInfo();
    handleFeatures(cardFeatures);
    toggleFeaturesVisibility(cardFeatures, ad);
    updatePhotos(cardPhotoTemplate, cardPhotosList, cardAvatar, ad);

    map.insertBefore(card, mapFiltersContainer);
  };

  var onCardEscPress = function (evt) {
    window.util.onEscEvent(evt, window.card.closeCard);
  };

  var onCloseBtnClick = function () {
    window.card.closeCard();
  };

  // Показываем карточку при клике по пину
  pinsList.addEventListener('click', function (evt) {
    target = evt.target;
    while (target !== pinsList) {
      if (target.tagName === 'BUTTON' && !target.classList.contains('map__pin--main')) {
        var setCardConfiguration = function () {
          // Добавляем события на закрытие попапа
          ads = window.filteredAds ? window.filteredAds : window.data;
          target.classList.add('map__pin--active');
          var ad = ads[target.getAttribute('id')];
          createCard(ad);
          document.addEventListener('keydown', onCardEscPress);
          cardCloseBtn.addEventListener('click', onCloseBtnClick);
        };
        // Отрисовываем карточку при взаимодействии с пином первый раз
        // Карточка перерисовывается если производится клик по пину с idшником отличным от текущего
        if (prevBtn === null) {
          setCardConfiguration();
        } else if (target.id !== prevBtn.id) {
          window.card.closeCard();
          setCardConfiguration();
        }
        prevBtn = target;

        return;
      }
      target = target.parentNode;
    }
  });
  return {
    closeCard: function () {
      if (map.contains(card)) {
        card.remove();
        prevBtn.classList.remove('map__pin--active');
        cardCloseBtn.removeEventListener('click', onCloseBtnClick);
        prevBtn = null;
      }
      document.removeEventListener('keydown', onCardEscPress);
    }
  };
}());
