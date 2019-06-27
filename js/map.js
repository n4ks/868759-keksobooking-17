'use strict';

(function () {
  var MAP_X_MIN = 0;
  var MAP_X_MAX = 1200;
  var MAP_Y_MIN = 130;
  var MAP_Y_MAX = 630;

  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');
  var mapFormElements = map.querySelector('.map__filters').querySelectorAll('.map__filter, .map__features');
  var addressField = form.querySelector('#address');
  var pinsList = document.querySelector('.map__pins');

  var mainPinCoords = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop
  };

  var mainPinSizes = {
    width: 65,
    height: 65,
    arrowHeight: 22
  };

  mainPin.style.zIndex = '10';
  window.util.disableElements(mapFormElements);

  // Инициализиуем поле 'адрес' начальными значениями координат основной метки
  var setAddressFieldValue = function (pinCoords, pinWidth, pinHeight, arrowHeight) {
    var arrow = 0;
    arrow = arrow === 0 ? 0 : arrowHeight;

    return (parseInt(pinCoords.x, 10) + (pinWidth / 2)).toFixed() + ', ' +
      (parseInt(pinCoords.y, 10) + (pinHeight / 2) + arrow).toFixed();
  };
  addressField.value = setAddressFieldValue(mainPinCoords, mainPinSizes.width, mainPinSizes.width);

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
          case shiftedCoords.y > (MAP_Y_MAX - (mainPinSizes.height + mainPinSizes.arrowHeight)):
            shiftedCoords.y = MAP_Y_MAX - (mainPinSizes.height + mainPinSizes.arrowHeight);
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

      // Переводим карту в активное состояние
      var setMapActive = function () {
        map.classList.remove('map--faded');
        window.util.enableElements(mapFormElements);
        // Выводим сгенерированные пины на экран
        pinsList.appendChild(window.pin.createPinsFragment());
      };

      window.util.isActiveModeOn(setMapActive());

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
}());
