'use strict';

window.util = (function () {
  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
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
    isActiveModeOn: function (action) {
      if (map.classList.contains('map--faded') && form.classList.contains('ad-form--disabled')) {
        action();
      }
    },
    preventDebounce: function (action) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(action, DEBOUNCE_INTERVAL);
    }
  };
}());
