'use strict';

var ADS_COUNT = 8;
var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
var ads = [];
var map = document.querySelector('.map');
var pinBtnPattern = document.querySelector('#pin').content.querySelector('.map__pin');
var pinsFragment = document.createDocumentFragment();
var MAP_WIDTH = map.offsetHeight;
var MAP_X_MIN = 0;
var MAP_X_MAX = MAP_WIDTH;
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

var getRandomArrayElement = function (arrLength) {
  var element = Math.floor(Math.random() * arrLength);

  return element;
};

var getRandomCoordinate = function (min, max) {
  return (Math.random() * (max - min) + min).toFixed();
}

var generateAds = function (adsCount) {
  var generatedAds = [];
  for (var i = 0; i < adsCount; i++) {
    var ad = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png',
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

ads = generateAds(ADS_COUNT);

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

appendFragmentElements(pinsFragment, ads);

var pinsList = document.querySelector('.map__pins');

pinsList.appendChild(pinsFragment);

map.classList.remove('map--faded');
