'use strict';

window.util = (function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;

  return {
    getRandomArrayElement: function (arrLength) {
      var element = Math.floor(Math.random() * arrLength);

      return element;
    },
    enableElements: function (elementsArray) {
      for (var i = 0; i < elementsArray.length; i++) {
        elementsArray[i].removeAttribute('disabled');
      }
    },
    disableElements: function (elementsArray) {
      for (var i = 0; i < elementsArray.length; i++) {
        elementsArray[i].setAttribute('disabled', 'disabled');
      }
    },
    preventDebounce: function (action) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(action, DEBOUNCE_INTERVAL);
    },
    onEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
  };
}());
