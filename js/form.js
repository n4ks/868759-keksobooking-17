'use strict';

window.form = (function () {
  var RESET_TIMER = 100;
  var SUCCESS_STATUS = 200;
  var GUESTS_VALIDATION_MSG = 'Недопустимое количество гостей для указанного количества комнат, выберите доступный вариант.';

  var InvalidState = {
    ENABLED: '2px solid tomato',
    DISABLED: '1px solid #d9d9d3'
  };
  var Palace = {
    ROOMS: '100',
    GUESTS: '0'
  };

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
  var successWindowTemplate = document.querySelector('#success').content.querySelector('.success');

  var formResetBtn = form.querySelector('.ad-form__reset');
  var successWindow;
  var mainElement = document.querySelector('main');
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

  window.util.disableElements(formFieldsets);

  var setDefault = function () {
    // Обнуляем бордеры от валидации
    formElements.forEach(function (element) {
      if (element.style.border === InvalidState.ENABLED) {
        element.style.border = InvalidState.DISABLED;
      }
    });
    // Удаляем все фотографии и ставим дефолтную аватарку
    window.pictures.resetPhotos();
    window.card.closeCard();
    window.map.setMapDefault();
    window.util.disableElements(formFieldsets);
  };

  formResetBtn.addEventListener('click', function () {
    setTimeout(setDefault, RESET_TIMER);

  });

  // Устанавливаем минимальное значение цены и плейсхолдер
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
      if (option.value === Palace.GUESTS && roomsNumberField.value !== Palace.ROOMS) {
        option.disabled = true;
      } else if (option.value !== Palace.GUESTS && roomsNumberField.value === Palace.ROOMS) {
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

  // Подсвечиваем поля при потере фокуса или сабмите на сервер если срабатывает валидация
  var setInvalidElementColor = function (target) {
    target.style.border = target.validity.valid ? InvalidState.DISABLED : InvalidState.ENABLED;
  };

  var setValidation = function () {
    formElements.forEach(function (element) {
      element.addEventListener('blur', function (evt) {
        setInvalidElementColor(evt.target);
      });
    });
  };

  var onSubmitClickValidate = function () {
    formElements.forEach(function (element) {
      setInvalidElementColor(element);
    });
  };

  // Окно успешной отправки данных
  var closeSuccessWindow = function () {
    successWindow.remove();
  };

  var onSuccessWindowClick = function () {
    closeSuccessWindow();
    document.removeEventListener('click', onSuccessWindowClick);
  };

  var onSuccessWIndowEscPress = function (evt) {
    window.util.onEscEvent(evt, closeSuccessWindow);
    document.removeEventListener('keydown', onSuccessWIndowEscPress);
  };
  // Окно ошибки при отправке данных

  // Обрабатываем ответ при отправке формы
  var onFormSubmit = function (evt) {
    var successCallback = function (status) {
      if (status === SUCCESS_STATUS) {
        successWindow = successWindowTemplate.cloneNode(true);
        successWindow.style.zIndex = '11';
        mainElement.insertBefore(successWindow, mainElement.firstChild);
        document.addEventListener('keydown', onSuccessWIndowEscPress);
        document.addEventListener('click', onSuccessWindowClick);
        form.reset();
        setDefault();
      }
    };

    var errorCallback = function (showErrorWindow) {
      showErrorWindow();
    };
    window.backend.submit(successCallback, errorCallback, new FormData(form));
    evt.preventDefault();
  };

  // Приводим поля в правильное состояние при загрузке страницы
  onHousingTypeChange();
  onRoomsNumberChange();
  onGuestsNumberChange();

  return {
    setFormActive: function () {
      form.classList.remove('ad-form--disabled');
      // делаем поле адрес доступным только для чтения
      addressField.setAttribute('readonly', 'true');
      window.util.enableElements(formFieldsets);
      // Добавляем подстветку невалидным полям
      setValidation();

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

      guestsNumberField.addEventListener('blur', onGuestsNumberChange);
      submitBtn.addEventListener('click', onSubmitClickValidate);
      form.addEventListener('submit', onFormSubmit);
    }
  };
}());
