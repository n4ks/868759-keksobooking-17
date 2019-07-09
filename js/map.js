'use strict';

(function () {
  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');
  var mapFormElements = map.querySelector('.map__filters').querySelectorAll('.map__filter, .map__features');
  var addressField = form.querySelector('#address');
  var isActiveMode = false;

  var mainPinCoords = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop
  };

  var MapLimit = {
    X_MIN: 0,
    X_MAX: 1200,
    Y_MIN: 130,
    Y_MAX: 630
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
    var arrow = arrowHeight !== 0 ? arrowHeight : 0;

    return (parseInt(pinCoords.x, 10) + (pinWidth / 2)).toFixed() + ', ' +
      (parseInt(pinCoords.y, 10) + (pinHeight / 2) + arrow).toFixed();
  };
  addressField.value = setAddressFieldValue(mainPinCoords, mainPinSizes.width, mainPinSizes.width, 0);

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
          case shiftedCoords.x < MapLimit.X_MIN:
            shiftedCoords.x = MapLimit.X_MIN;
            document.removeEventListener('mousemove', onPinMove);
            break;
          case shiftedCoords.x > (MapLimit.X_MAX - mainPinSizes.width):
            shiftedCoords.x = MapLimit.X_MAX - mainPinSizes.width;
            document.removeEventListener('mousemove', onPinMove);
            break;
          case shiftedCoords.y < MapLimit.Y_MIN:
            shiftedCoords.y = MapLimit.Y_MIN;
            document.removeEventListener('mousemove', onPinMove);
            break;
          case shiftedCoords.y > (MapLimit.Y_MAX - (mainPinSizes.height + mainPinSizes.arrowHeight)):
            shiftedCoords.y = MapLimit.Y_MAX - (mainPinSizes.height + mainPinSizes.arrowHeight);
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
        if (!isActiveMode) {
          map.classList.remove('map--faded');
          window.form.setFormActive();
          window.pictures.setPicturesEvents();
          // Запрашиваем данные
          var getData = function () {
            var successCallback = function (response) {
              if (response) {
                window.data = response;
                window.pin.renderPins(window.data);
                window.util.enableElements(mapFormElements);
              }
            };
            var errorCallback = function (showErrorWindow) {
              showErrorWindow();
            };

            window.backend.load(successCallback, errorCallback);
          };
          getData();

          isActiveMode = true;
        }
      };
      // setMapActive();
      window.util.isActiveModeOn(setMapActive);

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
