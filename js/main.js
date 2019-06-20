'use strict';

var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
var ads = [];
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var mapFormElements = map.querySelector('.map__filters').querySelectorAll('.map__filter, .map__features');
var pinBtnPattern = document.querySelector('#pin').content.querySelector('.map__pin');
var pinsFragment = document.createDocumentFragment();
var form = document.querySelector('.ad-form');
var formElements = form.querySelectorAll('.ad-form__element, .ad-form-header__input');
var pinsList = document.querySelector('.map__pins');
var adressField = form.querySelector('#address');

var ADS_COUNT = 8;
var IMG_NAME_LIMITER = 9;
var MAP_WIDTH = map.offsetHeight;
var MAP_X_MIN = 0;
var MAP_X_MAX = MAP_WIDTH;
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var disableElements = function (elementsArray) {
  for (var i = 0; i < elementsArray.length; i++) {
    elementsArray[i].setAttribute('disabled', 'disabled');
  }
};

var enableElements = function (elementsArray) {
  for (var i = 0; i < elementsArray.length; i++) {
    elementsArray[i].removeAttribute('disabled');
  }
};

var onPageLoaded = function () {
  disableElements(mapFormElements);
  disableElements(formElements);
  // Передаём координаты центра основной метки в инпут адрес
  adressField.value = (parseInt(mainPin.style.left, 10) + (MAIN_PIN_WIDTH / 2)).toFixed() +
    ', ' + (parseInt(mainPin.style.top, 10) + (MAIN_PIN_HEIGHT / 2)).toFixed();
};

// Ждём пока загрузится DOM
document.addEventListener('DOMContentLoaded', onPageLoaded);

var getRandomArrayElement = function (arrLength) {
  var element = Math.floor(Math.random() * arrLength);

  return element;
};

var getRandomCoordinate = function (min, max) {
  return (Math.random() * (max - min) + min).toFixed();
};

var generateAds = function (adsCount) {
  var generatedAds = [];
  for (var i = 0; i < adsCount; i++) {
    var ad = {
      author: {
        avatar: 'img/avatars/user' + (i < IMG_NAME_LIMITER ? '0' + (i + 1) : i + 1) + '.png'
      },
      offer: {
        type: offerTypes[getRandomArrayElement(offerTypes.length)]
      },
      location: {
        x: getRandomCoordinate(MAP_X_MIN, MAP_X_MAX) - (PIN_WIDTH / 2),
        y: getRandomCoordinate(MAP_Y_MIN, MAP_Y_MAX) - PIN_HEIGHT
      }
    };
    generatedAds.push(ad);
  }

  return generatedAds;
};

var generatePinElement = function (adsArray) {
  var pin = pinBtnPattern.cloneNode(true);
  var pinAvatar = pin.querySelector('img');

  pin.style.left = adsArray.location.x + 'px';
  pin.style.top = adsArray.location.y + 'px';
  pinAvatar.src = adsArray.author.avatar;
  pinAvatar.alt = 'заголовок объявления';

  return pin;
};

var appendFragmentElements = function (fragment, adsArray) {
  for (var i = 0; i < adsArray.length; i++) {
    fragment.appendChild(generatePinElement(adsArray[i]));
  }
};

var onMainPinClick = function () {
  // гененируем объекты
  ads = generateAds(ADS_COUNT);
  //  Снимаем блок с карты и формы
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  enableElements(mapFormElements);
  enableElements(formElements);
  // Выводим сгенерированные пины на экран
  appendFragmentElements(pinsFragment, ads);
  pinsList.appendChild(pinsFragment);

  mainPin.removeEventListener('click', onMainPinClick);
};

mainPin.addEventListener('click', onMainPinClick);
