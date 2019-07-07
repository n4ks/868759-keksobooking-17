'use strict';

window.form = (function () {
  var form = document.querySelector('.ad-form');
  var formElements = form.querySelectorAll('.ad-form__element, .ad-form-header__input');
  var addressField = form.querySelector('#address');
  var housingTypeField = form.querySelector('#type');
  var pricePerNightField = form.querySelector('#price');
  var timeInField = form.querySelector('#timein');
  var timeOutField = form.querySelector('#timeout');
  var roomsNumberField = form.querySelector('#room_number');
  var roomsFieldOptions = roomsNumberField.querySelectorAll('option');
  var guestsNumberField = form.querySelector('#capacity');
  var guestsFieldOptions = Array.from(guestsNumberField.querySelectorAll('option'));

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

  // form.classList.add('ad-form--disabled');
  window.util.disableElements(formElements);

  // устанавливаем минимальное значение цены и плейсхолдер
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

  // Синхронизируем поля въезда/выезда
  var setFieldsAttrSync = function (firstField, secondField) {
    if (firstField.value !== secondField.value) {
      secondField.value = firstField.value;
    }
  };

  // Синхронизируем количество комнат и гостей
  // 1 - 1
  // 2 - 2 || 1
  // 3 - 3 || 2 || 1
  // 100 - 0

  var onRoomsNumberChange = function () {
    guestsFieldOptions.forEach(function (option) {

      if (roomsNumberField.value === '100' && option.value !== '0') {
        option.disabled = true;
        guestsNumberField.value = '0';
      } else if (roomsNumberField.value < option.value || option.value === '0') {
        option.disabled = true;
      }
    });
  };

  // Приводим поля в правильное состояние при загрузке страницы
  onHousingTypeChange();
  onRoomsNumberChange();

  return {
    setFormActive: function () {
      form.classList.remove('ad-form--disabled');
      // делаем поле адрес доступным только для чтения
      addressField.setAttribute('readonly', 'true');
      window.util.enableElements(formElements);

      housingTypeField.addEventListener('change', onHousingTypeChange);

      timeInField.addEventListener('change', function () {
        setFieldsAttrSync(timeInField, timeOutField);
      });
      timeOutField.addEventListener('change', function () {
        setFieldsAttrSync(timeOutField, timeInField);
      });

      roomsNumberField.addEventListener('change', function () {
        // Включаем все варианты перед проверкой
        guestsFieldOptions.forEach(function (option) {
          if (option.disabled === true) {
            option.disabled = false;
          }
        });
        onRoomsNumberChange();
      });
    }
  };
}());
