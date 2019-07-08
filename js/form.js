'use strict';

window.form = (function () {
  var SUCCESS_STATUS = 200;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var GUESTS_VALIDATION_MSG = 'Недопустимое количество гостей для указанного количества комнат, выберите доступный вариант.';
  var INVALID_STATE = {
    ENABLED: '2px solid tomato',
    DISABLED: 'none'
  };
  var PALACE = {
    ROOMS: '100',
    GUESTS: '0'
  };

  var form = document.querySelector('.ad-form');
  var formFieldsets = form.querySelectorAll('.ad-form__element, .ad-form-header__input');
  var formElements = Array.from(form.querySelectorAll('input, select'));
  var avatarUpload = form.querySelector('#avatar');
  var avatar = form.querySelector('.ad-form-header__preview img');
  var addressField = form.querySelector('#address');
  var photosUpload = form.querySelector('#images');
  var photosContainer = form.querySelector('.ad-form__photo--container');
  var photo = form.querySelector('.ad-form__photo');
  var housingTypeField = form.querySelector('#type');
  var pricePerNightField = form.querySelector('#price');
  var timeInField = form.querySelector('#timein');
  var timeOutField = form.querySelector('#timeout');
  var roomsNumberField = form.querySelector('#room_number');
  var guestsNumberField = form.querySelector('#capacity');
  var guestsFieldOptions = Array.from(guestsNumberField.querySelectorAll('option'));
  var submitBtn = form.querySelector('.ad-form__submit');
  var successWindowTemplate = document.querySelector('#success').content.querySelector('.success');
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


  var uploadPicture = function (uploadInput, pictureTemplate) {
    var file = uploadInput.files[0];
    var fileName = file.name.toLowerCase();

    var checkFIleFormat = FILE_TYPES.some(function (format) {
      return fileName.endsWith(format);
    });

    if (checkFIleFormat) {
      var fileReader = new FileReader();

      var onFileLoad = function () {
        pictureTemplate.src = fileReader.result;
        fileReader.removeEventListener('load', onFileLoad);
      };

      fileReader.addEventListener('load', onFileLoad);

      fileReader.readAsDataURL(file);
    }
  };
  // Загрузка аватара
  var onAvatarChange = function () {
    uploadPicture(avatarUpload, avatar);
  };

  // Загрузка фото
  var onPhotoChange = function () {
    uploadPicture(photosUpload);
  };

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

  // Подсвечиваем поля при потере фокуса или сабмите на сервер если срабатывает валидация
  var setInvalidElementColor = function (target) {
    if (!target.validity.valid) {
      target.style.border = INVALID_STATE.ENABLED;
    } else {
      target.style.border = INVALID_STATE.DISABLED;
    }
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

  // Обрабатываем ответ при отправке формы
  var onFormSubmit = function (evt) {
    var successCallback = function (status) {
      if (status === SUCCESS_STATUS) {
        successWindow = successWindowTemplate.cloneNode(true);
        successWindow.style.zIndex = '11';
        mainElement.insertBefore(successWindow, mainElement.firstChild);
        document.addEventListener('keydown', onSuccessWIndowEscPress);
        document.addEventListener('click', onSuccessWindowClick);
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

      avatarUpload.addEventListener('change', onAvatarChange);
      photosUpload.addEventListener('change', onPhotoChange);
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
