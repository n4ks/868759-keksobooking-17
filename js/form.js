'use strict';

window.form = (function () {
  var PALACE = {
    ROOMS: '100',
    GUESTS: '0'
  };
  var GUESTS_VALIDATION_MSG = 'Недопустимое количество гостей для указанного количества комнат, выберите доступный вариант.';

  var form = document.querySelector('.ad-form');
  var formFieldsets = form.querySelectorAll('.ad-form__element, .ad-form-header__input');
  var formElements = Array.from(form.querySelectorAll('input, select'));
  var addressField = form.querySelector('#address');
  var housingTypeField = form.querySelector('#type');
  var pricePerNightField = form.querySelector('#price');
  var timeInField = form.querySelector('#timein');
  var timeOutField = form.querySelector('#timeout');
  var roomsNumberField = form.querySelector('#room_number');
  var guestsNumberField = form.querySelector('#capacity');
  var guestsFieldOptions = Array.from(guestsNumberField.querySelectorAll('option'));
  var submitBtn = form.querySelector('.ad-form__submit');

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
  window.util.disableElements(formFieldsets);

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
  var onRoomsNumberChange = function () {
    guestsFieldOptions.forEach(function (option) {
      if (option.value === PALACE.GUESTS && roomsNumberField.value !== PALACE.ROOMS) {
        option.disabled = true;
      } else if (option.value !== PALACE.GUESTS && roomsNumberField.value === PALACE.ROOMS) {
        option.disabled = true;
      } else if (option.value > roomsNumberField.value) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
  };

  var onGuestsNumberChange = function () {
    guestsFieldOptions.forEach(function (option) {
      if (guestsNumberField.value === option.value && option.disabled) {
        guestsNumberField.setCustomValidity(GUESTS_VALIDATION_MSG);
      } else if (guestsNumberField.value === option.value && option.disabled === false) {
        guestsNumberField.setCustomValidity('');
      }
    });
  };

  // Приводим поля в правильное состояние при загрузке страницы
  onHousingTypeChange();
  onRoomsNumberChange();
  onGuestsNumberChange();

  var onFormSubmit = function () {
    formElements.forEach(function (element) {
      if (!element.validity.valid) {
        element.style.border = '2px solid tomato';
      } else {
        element.style.border = 'none';
      }
    });
  };

  formElements.forEach(function (element) {
    element.addEventListener('input', function (evt) {
      if (!evt.target.validity.valid) {
        evt.target.style.border = '2px solid tomato';
      } else {
        evt.target.style.border = 'none';
      }
    });
  });

  return {
    setFormActive: function () {
      form.classList.remove('ad-form--disabled');
      // делаем поле адрес доступным только для чтения
      addressField.setAttribute('readonly', 'true');
      window.util.enableElements(formFieldsets);

      housingTypeField.addEventListener('change', onHousingTypeChange);

      timeInField.addEventListener('change', function () {
        setFieldsAttrSync(timeInField, timeOutField);
      });
      timeOutField.addEventListener('change', function () {
        setFieldsAttrSync(timeOutField, timeInField);
      });

      roomsNumberField.addEventListener('change', function () {
        onRoomsNumberChange();
        onGuestsNumberChange();
      });

      guestsNumberField.addEventListener('input', onGuestsNumberChange);
      submitBtn.addEventListener('click', onFormSubmit);
    }
  };
}());
