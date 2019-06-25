'use strict';

var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var mapFormElements = map.querySelector('.map__filters').querySelectorAll('.map__filter, .map__features');
var pinBtnPattern = document.querySelector('#pin').content.querySelector('.map__pin');
var pinsFragment = document.createDocumentFragment();
var form = document.querySelector('.ad-form');
var formElements = form.querySelectorAll('.ad-form__element, .ad-form-header__input');
var pinsList = document.querySelector('.map__pins');
var addressField = form.querySelector('#address');
var housingTypeField = form.querySelector('#type');
var pricePerNightField = form.querySelector('#price');
var timeInField = form.querySelector('#timein');
var timeOutField = form.querySelector('#timeout');
var housingTypeSettings = {
  bungalo: {
    min: 0,
    placeholder: 0
  },
  flat: {
    min: 1000,
    placeholder: 1000
  },
  house: {
    min: 5000,
    placeholder: 5000
  },
  palace: {
    min: 10000,
    placeholder: 10000
  }
};
var mainPinCoords = {
  x: mainPin.offsetLeft,
  y: mainPin.offsetTop
};

var mainPinSizes = {
  width: 65,
  height: 65,
  arrowHeight: 22
};

var pinSizes = {
  width: 50,
  height: 70
};

var ADS_COUNT = 8;
var IMG_NAME_LIMITER = 9;
var MAP_X_MIN = 0;
var MAP_X_MAX = 1200;
var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var MAIN_PIN_ARROW_HEIGHT = 22;
var AVATAR_PATH = 'img/avatars/user';
var AD_HEADLINE = 'заголовок объявления';

mainPin.style.zIndex = '10';

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

var setAddressFieldValue = function (pinCoords, pinWidth, pinHeight, arrowHeight) {
  var arrow = 0;
  arrow = arrow === 0 ? 0 : arrowHeight;

  return (parseInt(pinCoords.x, 10) + (pinWidth / 2)).toFixed() + ', ' +
    (parseInt(pinCoords.y, 10) + (pinHeight / 2) + arrow).toFixed();
};

var onPageLoaded = function () {
  disableElements(mapFormElements);
  disableElements(formElements);
  // Передаём координаты центра основной метки в адрес
  addressField.value = setAddressFieldValue(mainPinCoords, mainPinSizes.width, mainPinSizes.width);
};

// Ждём пока загрузится DOM
document.addEventListener('DOMContentLoaded', onPageLoaded);

var getRandomArrayElement = function (arrLength) {
  var element = Math.floor(Math.random() * arrLength);

  return element;
};

var getRandomCoordinate = function (min, max) {
  return parseInt((Math.random() * (max - min) + min).toFixed(), 10);
};

var generateAds = function (adsCount) {
  var generatedAds = [];
  for (var i = 0; i < adsCount; i++) {
    var ad = {
      author: {
        avatar: AVATAR_PATH + (i < IMG_NAME_LIMITER ? '0' + (i + 1) : i + 1) + '.png'
      },
      offer: {
        type: offerTypes[getRandomArrayElement(offerTypes.length)]
      },
      location: {
        x: getRandomCoordinate(MAP_X_MIN + (pinSizes.width / 2), MAP_X_MAX - (pinSizes.width / 2)),
        y: getRandomCoordinate(MAP_Y_MIN + pinSizes.height, MAP_Y_MAX - pinSizes.height)
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
  pinAvatar.alt = AD_HEADLINE;
  return pin;
};

var appendFragmentElements = function (fragment, adsArray) {
  for (var i = 0; i < adsArray.length; i++) {
    fragment.appendChild(generatePinElement(adsArray[i]));
  }
};

var onHousingTypeChange = function () {
  var selectedValue = housingTypeField.value;
  var selectedValueSettings = housingTypeSettings[selectedValue];
  var attributes = Object.keys(selectedValueSettings);

  for (var i = 0; i < attributes.length; i++) {
    var currentAttr = attributes[i];
    var currentAttrValue = selectedValueSettings[currentAttr];
    pricePerNightField.setAttribute(currentAttr, currentAttrValue);
  }
};

var onMainPinClick = function () {
  // гененируем объекты
  var ads = generateAds(ADS_COUNT);
  //  Снимаем блок с карты и формы
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  // делаем поле адрес доступным только для чтения
  addressField.setAttribute('readonly', 'true');
  enableElements(mapFormElements);
  enableElements(formElements);
  // устанавливаем минимальное значение цены в зависимости от выбранного поля для предотвращения отправки в случае если пользователь не менял тип жилья
  onHousingTypeChange();
  // Выводим сгенерированные пины на экран
  appendFragmentElements(pinsFragment, ads);
  pinsList.appendChild(pinsFragment);

  mainPin.removeEventListener('click', onMainPinClick);
};

// mainPin.addEventListener('click', onMainPinClick);

housingTypeField.addEventListener('change', onHousingTypeChange);

mainPin.addEventListener('mousedown', function (evt) {

  // Получаем координаты клика
  var clickCoords = {
    x: evt.pageX,
    y: evt.pageY
  };

  var onPinMove = function (moveEvt) {
    // Определяем сдвиг метки
    var mainPinShift = {
      x: clickCoords.x - moveEvt.pageX,
      y: clickCoords.y - moveEvt.pageY
    };

    // Переопределяем координаты метки после сдвига
    clickCoords = {
      x: moveEvt.pageX,
      y: moveEvt.pageY
    };

    var shiftedCoords = {
      x: mainPin.offsetLeft - mainPinShift.x,
      y: mainPin.offsetTop - mainPinShift.y
    };

    var restrictMoveArea = function () {
      switch (true) {
        case shiftedCoords.x < MAP_X_MIN:
          shiftedCoords.x = MAP_X_MIN;
          document.removeEventListener('mousemove', onPinMove);
          break;
        case shiftedCoords.x > (MAP_X_MAX - mainPinSizes.width):
          shiftedCoords.x = MAP_X_MAX - mainPinSizes.width;
          document.removeEventListener('mousemove', onPinMove);
          break;
        case shiftedCoords.y < MAP_Y_MIN:
          shiftedCoords.y = MAP_Y_MIN;
          document.removeEventListener('mousemove', onPinMove);
          break;
        case shiftedCoords.y > (MAP_Y_MAX - (mainPinSizes.height + MAIN_PIN_ARROW_HEIGHT)):
          shiftedCoords.y = MAP_Y_MAX - (mainPinSizes.height + MAIN_PIN_ARROW_HEIGHT);
          document.removeEventListener('mousemove', onPinMove);
          break;
        default:
          break;
      }
    };
    restrictMoveArea();
    // Присваиваем метке новые координаты
    mainPin.style.top = (shiftedCoords.y) + 'px';
    mainPin.style.left = (shiftedCoords.x) + 'px';

    // // Переводим карту и форму в активное состояние
    var isActiveModeOn = map.classList.contains('map--faded') && form.classList.contains('ad-form--disabled');

    if (isActiveModeOn) {
      // гененируем объекты
      var ads = generateAds(ADS_COUNT);
      //  Снимаем блок с карты и формы
      map.classList.remove('map--faded');
      form.classList.remove('ad-form--disabled');
      // делаем поле адрес доступным только для чтения
      addressField.setAttribute('readonly', 'true');
      enableElements(mapFormElements);
      enableElements(formElements);
      // устанавливаем минимальное значение цены в зависимости от выбранного поля для предотвращения отправки в случае если пользователь не менял тип жилья
      onHousingTypeChange();
      // Выводим сгенерированные пины на экран
      appendFragmentElements(pinsFragment, ads);
      pinsList.appendChild(pinsFragment);
    }

    // Записываем координаты метки в поле 'адрес' учитывая указатель

    addressField.value = setAddressFieldValue(shiftedCoords, mainPinSizes.width, (mainPinSizes.height + mainPinSizes.height), mainPinSizes.arrowHeight);
  };

  var onMouseUp = function () {

    document.removeEventListener('mousemove', onPinMove);
    mainPin.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onPinMove);
  mainPin.addEventListener('mouseup', onMouseUp);

});

var setFieldsAttrSync = function (firstField, secondField) {
  if (firstField.value !== secondField.value) {
    secondField.value = firstField.value;
  }
};

timeInField.addEventListener('change', function () {
  setFieldsAttrSync(timeInField, timeOutField);
});
timeOutField.addEventListener('change', function () {
  setFieldsAttrSync(timeOutField, timeInField);
});
