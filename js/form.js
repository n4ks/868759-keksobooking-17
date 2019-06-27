'use strict';

(function () {
  var form = document.querySelector('.ad-form');
  var formElements = form.querySelectorAll('.ad-form__element, .ad-form-header__input');
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

  window.util.disableElements(formElements);

  // Переводим форму в активное состояние
  var setFormActive = function () {
    form.classList.remove('ad-form--disabled');
    // делаем поле адрес доступным только для чтения
    addressField.setAttribute('readonly', 'true');
    window.util.enableElements(formElements);

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

    onHousingTypeChange();
    housingTypeField.addEventListener('change', onHousingTypeChange);

    // Синхронизируем поля въезда/выезда
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
  };

  window.util.isActiveModeOn(setFormActive());
}());
