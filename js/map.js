'use strict';

window.map = (function () {
  var SELECT_DEFAULT_VALUE = 'any';

  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');
  var mapFormElements = map.querySelector('.map__filters').querySelectorAll('.map__filter, .map__features');
  var addressField = form.querySelector('#address');
  var isActiveMode = false;
  var MainPinCoord = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop
  };

  var MapLimit = {
    X_MIN: 0,
    X_MAX: 1200,
    Y_MIN: 130,
    Y_MAX: 630
  };

  var MainPinSize = {
    WIDTH: 65,
    HEIGHT: 65,
    ARROW_HEIGHT: 22
  };

  mainPin.style.zIndex = '10';
  window.util.disableElements(mapFormElements);

  // Инициализиуем поле 'адрес' начальными значениями координат основной метки
  var setAddressFieldValue = function (pinCoords, pinWidth, pinHeight, arrowHeight) {
    // debugger
    var arrow = arrowHeight !== 0 ? arrowHeight : 0;

    return (parseInt(pinCoords.x, 10) + (pinWidth / 2)).toFixed() + ', ' +
      (parseInt(pinCoords.y, 10) + (pinHeight / 2) + arrow).toFixed();
  };
  addressField.value = setAddressFieldValue(MainPinCoord, MainPinSize.WIDTH, MainPinSize.HEIGHT, 0);

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

  var setMapActive = function () {
    map.classList.remove('map--faded');
    window.form.setFormActive();
    window.pictures.addPicturesEvents();
    // Запрашиваем данные
    getData();
    isActiveMode = true;
  };

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
            break;
          case shiftedCoords.x > (MapLimit.X_MAX - MainPinSize.WIDTH):
            shiftedCoords.x = MapLimit.X_MAX - MainPinSize.WIDTH;
            break;
          case shiftedCoords.y < MapLimit.Y_MIN:
            shiftedCoords.y = MapLimit.Y_MIN;
            break;
          case shiftedCoords.y > (MapLimit.Y_MAX - (MainPinSize.HEIGHT + MainPinSize.ARROW_HEIGHT)):
            shiftedCoords.y = MapLimit.Y_MAX - (MainPinSize.HEIGHT + MainPinSize.ARROW_HEIGHT);
            break;
          default:
            break;
        }
      };
      restrictMoveArea();

      // Присваиваем метке новые координаты
      mainPin.style.top = shiftedCoords.y + 'px';
      mainPin.style.left = shiftedCoords.x + 'px';

      // Переводим карту в активное состояние
      if (!isActiveMode) {
        setMapActive();
      }

      // Записываем координаты метки в поле 'адрес' учитывая указатель
      addressField.value = setAddressFieldValue(shiftedCoords, MainPinSize.WIDTH, (MainPinSize.HEIGHT + MainPinSize.HEIGHT), MainPinSize.ARROW_HEIGHT);
    };

    var onMouseUp = function () {

      document.removeEventListener('mousemove', onPinMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onPinMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  return {
    setMapDefault: function () {
      // Переводим все элементы в начальное состояние
      isActiveMode = false;
      // Сбрасываем положение главного пина
      mainPin.style.top = MainPinCoord.y + 'px';
      mainPin.style.left = MainPinCoord.x + 'px';
      addressField.value = setAddressFieldValue(MainPinCoord, MainPinSize.WIDTH, MainPinSize.HEIGHT, 0);
      // Удаляем пины с объявлениями
      var mapPins = Array.from(map.querySelectorAll('.map__pin:not(.map__pin--main)'));
      mapPins.forEach(function (pin) {
        pin.remove();
      });
      // Сбрасываем селекты
      var mapFormSelects = Array.from(map.querySelector('.map__filters').querySelectorAll('.map__filter'));
      mapFormSelects.forEach(function (select) {
        if (select.value !== SELECT_DEFAULT_VALUE) {
          select.value = SELECT_DEFAULT_VALUE;
        }
      });
      // Обнуляем активные чекбоксы на карте
      var mapCheckboxes = Array.from(map.querySelectorAll('.map__features input:checked'));
      mapCheckboxes.forEach(function (checkbox) {
        checkbox.checked = false;
      });

      // Блокируем форму и карту
      map.classList.add('map--faded');
      form.classList.add('ad-form--disabled');
    }
  };
}());
