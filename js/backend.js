'use strict';

window.backend = (function () {

  var onServerResponse = function (url, requestType, successCallback, errorCallback, data) {
    var responseMsg;
    var Code = {
      SUCCESS: 200,
      BAD_REQUEST_ERROR: 400,
      UNAUTHORIZED_ERROR: 401,
      NOT_FOUND_ERROR: 404,
      SERVER_ERROR: 500
    };

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case Code.SUCCESS:
          successCallback(xhr.response);
          break;
        case Code.BAD_REQUEST_ERROR:
          responseMsg = 'Неверный запрос';
          break;
        case Code.UNAUTHORIZED_ERROR:
          responseMsg = 'Пользователь не авторизован';
          break;
        case Code.NOT_FOUND_ERROR:
          responseMsg = 'Ничего не найдено';
          break;
        case Code.SERVER_ERROR:
          responseMsg = 'Ошибка сервера';
          break;
        default:
          responseMsg = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
          break;
      }

      if (responseMsg) {
        errorCallback();
      }

      xhr.timeout = 10000;

      xhr.addEventListener('error', function () {
        errorCallback('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        errorCallback('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
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
      var URL = 'https://js.dump.academy/keksobooking/data';

      onServerResponse(URL, 'GET', successCallback, errorCallback);
    },
    // На будущее
    // submit: function (successCallback, errorCallback) {
    //   var URL = 'https://js.dump.academy/keksobooking';

    //   onServerResponse(URL, 'POST', successCallback, errorCallback);
    // }
  };
}(

));
