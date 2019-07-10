'use strict';

window.backend = (function () {
  var SERVER_URL = {
    PATH: 'https://js.dump.academy/keksobooking/',
    DATA: 'data'
  };

  var Code = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
  };

  var ErrorMessage = {
    BAD_REQUEST: 'Неверный запрос',
    UNAUTHORIZED: 'Пользователь не авторизован',
    NOT_FOUND: 'Ничего не найдено',
    SERVER_ERROR: 'Ошибка сервера',
    DEFAULT: 'Cтатус ответа: : ',
    CONNECTION_ERROR: 'Произошла ошибка соединения',
    BAD_GATEWAY: 'Ошибочный шлюз',
    SERVICE_UNAVAILABLE: 'Сервис недоступен',
    TIMEOUT: {
      MESSAGE: 'Запрос не успел выполниться за ',
      FORMAT: 'мс'
    }
  };

  var onServerResponse = function (url, requestType, successCallback, errorCallback, data) {
    var errorMsg;

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case Code.SUCCESS:
          if (data) {
            successCallback(xhr.status);
          } else {
            successCallback(xhr.response);
          }
          break;
        case Code.BAD_REQUEST:
          errorMsg = ErrorMessage.BAD_REQUEST;
          break;
        case Code.UNAUTHORIZED:
          errorMsg = ErrorMessage.UNAUTHORIZED;
          break;
        case Code.NOT_FOUND:
          errorMsg = ErrorMessage.NOT_FOUND;
          break;
        case Code.SERVER_ERROR:
          errorMsg = ErrorMessage.SERVER_ERROR;
          break;
        case Code.BAD_GATEWAY:
          errorMsg = ErrorMessage.BAD_GATEWAY;
          break;
        case Code.SERVICE_UNAVAILABLE:
          errorMsg = ErrorMessage.SERVICE_UNAVAILABLE;
          break;
        default:
          errorMsg = ErrorMessage.DEFAULT + xhr.status + ' ' + xhr.statusText;
          break;
      }

      if (errorMsg) {
        var errorElement = document.querySelector('#error').content.querySelector('.error');
        var errorWindow = errorElement.cloneNode(true);

        var showErrorWindow = function () {
          errorWindow.style.zIndex = 15;
          var errorElementText = errorWindow.querySelector('.error__message');
          errorElementText.textContent = errorMsg;
          document.body.insertAdjacentElement('afterbegin', errorWindow);
        };
        errorCallback(showErrorWindow);

        var errorWindowBtn = errorWindow.querySelector('.error__button');

        var closeErrorWindow = function () {
          errorWindow.remove();
        };

        var onErrorWindowClick = function () {
          closeErrorWindow();
          document.removeEventListener('click', onErrorWindowClick);
        };

        var onErrorWindowEscPress = function (evt) {
          window.util.onEscEvent(evt, closeErrorWindow);
          document.removeEventListener('keydown', onErrorWindowEscPress);
        };

        var onErrorWindowBtnClick = function () {
          closeErrorWindow();
          errorWindowBtn.removeEventListener('click', onErrorWindowBtnClick);
        };
        document.addEventListener('keydown', onErrorWindowEscPress);
        document.addEventListener('click', onErrorWindowClick);
        errorWindowBtn.addEventListener('click', onErrorWindowBtnClick);
      }

      xhr.timeout = 10000;

      xhr.addEventListener('error', function () {
        errorCallback(ErrorMessage.CONNECTION_ERROR);
      });

      xhr.addEventListener('timeout', function () {
        errorCallback(ErrorMessage.TIMEOUT.MESSAGE + xhr.timeout + ErrorMessage.TIMEOUT.FORMAT);
      });
    });

    xhr.open(requestType, url);

    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  return {
    load: function (successCallback, errorCallback) {

      onServerResponse(SERVER_URL.PATH + SERVER_URL.DATA, 'GET', successCallback, errorCallback);
    },
    submit: function (successCallback, errorCallback, data) {
      onServerResponse(SERVER_URL.PATH, 'POST', successCallback, errorCallback, data);
    }
  };
}());
